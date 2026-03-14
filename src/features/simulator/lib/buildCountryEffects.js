import {
  countrySecondarySnapshot,
  getCountrySecondaryProfile,
} from '../data/countrySecondaryProfiles.js'
import { countriesById } from '../data/network.js'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function scoreBand(score) {
  if (score >= 74) {
    return 'Severe'
  }

  if (score >= 56) {
    return 'High'
  }

  if (score >= 34) {
    return 'Elevated'
  }

  return 'Low'
}

function basisRank(basis) {
  if (basis === 'observed') {
    return 3
  }

  if (basis === 'observed-inferred') {
    return 2
  }

  return 1
}

function combineBasisTag(bases) {
  const minRank = Math.min(...bases.map(basisRank))

  if (minRank >= 3) {
    return 'observed'
  }

  if (minRank === 2) {
    return 'observed-inferred'
  }

  return 'modelled'
}

function confidenceFromBasis(basis, score) {
  if (basis === 'observed') {
    return score >= 50 ? 'High' : 'Medium'
  }

  if (basis === 'observed-inferred') {
    return score >= 40 ? 'Medium' : 'Low'
  }

  return 'Low'
}

function pressurePhrase(score) {
  if (score >= 74) {
    return 'sharp upward pressure'
  }

  if (score >= 50) {
    return 'clear upward pressure'
  }

  if (score >= 25) {
    return 'limited upward pressure'
  }

  return 'minimal pressure'
}

function toSignalLine(label, score, band) {
  return `${label} ${score}/100 (${band.toLowerCase()})`
}

function hasEnergyOutcome(outcomeId) {
  return ['crude', 'gasoline', 'lng', 'energy', 'fuel'].includes(outcomeId)
}

function hasShippingOutcome(outcomeId) {
  return ['freight', 'delivery', 'insurance', 'detour', 'black-sea'].includes(
    outcomeId,
  )
}

function average(values) {
  if (!values.length) {
    return 0
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function computePrimaryScores(effectPoints, activePoint) {
  if (!effectPoints.length) {
    return {
      energyImportScore: 8,
      shippingRouteScore: 10,
      routeDependence: 0,
      routeBasis: 'modelled',
      routeSource: 'No controllable chokepoint in this scenario.',
    }
  }

  const selected = activePoint ?? effectPoints[0]
  const energyOutcomes = selected.outcomes.filter((outcome) =>
    hasEnergyOutcome(outcome.id),
  )
  const shippingOutcomes = selected.outcomes.filter((outcome) =>
    hasShippingOutcome(outcome.id),
  )
  const avgRouteDependence = average(
    effectPoints.map((point) => point.modelledImportShare),
  )
  const energyScore = clamp(
    Math.round(
      (average(energyOutcomes.map((item) => item.score)) || selected.score * 0.76) +
        avgRouteDependence * 0.28,
    ),
    5,
    98,
  )
  const shippingScore = clamp(
    Math.round(
      (average(shippingOutcomes.map((item) => item.score)) || selected.score * 0.68) +
        avgRouteDependence * 0.22,
    ),
    5,
    98,
  )

  return {
    energyImportScore: energyScore,
    shippingRouteScore: shippingScore,
    routeDependence: Math.round(avgRouteDependence),
    routeBasis: selected.dataBasis,
    routeSource: selected.dataSource,
  }
}

function buildEffectItem({
  id,
  type,
  label,
  score,
  basis,
  source,
  summary,
}) {
  const normalizedScore = clamp(Math.round(score), 3, 98)

  return {
    id,
    type,
    label,
    score: normalizedScore,
    band: scoreBand(normalizedScore),
    effect: pressurePhrase(normalizedScore),
    confidence: confidenceFromBasis(basis, normalizedScore),
    dataBasis: basis,
    dataSource: source,
    summary,
  }
}

const lensOutcomeIds = {
  oil: ['crude', 'lng', 'energy', 'fuel', 'gasoline'],
  petrol: ['gasoline', 'fuel', 'crude'],
  freight: ['freight', 'delivery', 'insurance', 'detour', 'black-sea', 'grain'],
  inflation: ['gasoline', 'fuel', 'freight', 'delivery', 'insurance', 'detour'],
  electricity: ['lng', 'energy', 'fuel', 'gasoline'],
  industry: ['freight', 'delivery', 'components', 'insurance', 'detour', 'black-sea'],
}

function averageOutcomeScore(point, outcomeIds, fallbackScale = 0.7) {
  const matched = point.outcomes.filter((outcome) => outcomeIds.includes(outcome.id))

  if (!matched.length) {
    return clamp(Math.round(point.score * fallbackScale), 6, 98)
  }

  return clamp(
    Math.round(average(matched.map((outcome) => outcome.score))),
    6,
    98,
  )
}

function computeLensSignal(point, lensId) {
  if (lensId === 'inflation') {
    const fuelSignal = averageOutcomeScore(point, lensOutcomeIds.petrol, 0.72)
    const freightSignal = averageOutcomeScore(point, lensOutcomeIds.freight, 0.68)
    return clamp(Math.round(fuelSignal * 0.56 + freightSignal * 0.44), 6, 98)
  }

  if (lensId === 'industry') {
    const freightSignal = averageOutcomeScore(point, lensOutcomeIds.freight, 0.7)
    const componentSignal = averageOutcomeScore(point, ['components', 'delivery'], 0.66)
    return clamp(Math.round(freightSignal * 0.64 + componentSignal * 0.36), 6, 98)
  }

  if (lensId === 'electricity') {
    const energySignal = averageOutcomeScore(point, lensOutcomeIds.electricity, 0.62)
    return clamp(Math.round(energySignal * 0.78 + point.score * 0.22), 6, 98)
  }

  return averageOutcomeScore(point, lensOutcomeIds[lensId] ?? [], 0.68)
}

function buildReasonContributions({ lensId, effectPoints }) {
  if (!effectPoints.length) {
    return []
  }

  const rawReasonRows = effectPoints.map((point) => {
    const routeDependencePct = clamp(Math.round(point.modelledImportShare ?? 0), 0, 100)
    const rawRouteSharePct = clamp(Math.round(point.routeShareRawPct ?? routeDependencePct), 0, 100)
    const controlEffectiveScorePct = clamp(
      Math.round(point.controlEffectiveScorePct ?? 0),
      0,
      100,
    )
    const controlThresholdPct = clamp(
      Math.round(point.controlThresholdPct ?? 0),
      0,
      100,
    )
    const controlMarginPct = Math.round(
      point.controlMarginPct ?? controlEffectiveScorePct - controlThresholdPct,
    )
    const lensSignal = computeLensSignal(point, lensId)
    const bypassPct = clamp(Math.round(point.pipelineBypassPct ?? 0), 0, 100)
    const lngImportExposurePct = clamp(Math.round(point.lngImportExposurePct ?? 0), 0, 100)
    const portConcentrationScore = clamp(
      Number((point.portConcentrationScore ?? 0.5).toFixed(2)),
      0,
      1,
    )
    const throughputMbd = Number(point.transitMbd ?? 0)
    const bypassDrag = clamp(1 - bypassPct / 100, 0.32, 1)
    const controlFactor = clamp(
      controlEffectiveScorePct / 100 + controlMarginPct / 240,
      0.2,
      1.42,
    )
    const structuralFactor = clamp(
      1 + portConcentrationScore * 0.22 + (lngImportExposurePct / 100) * 0.18,
      0.84,
      1.36,
    )
    const throughputFactor = clamp(0.72 + throughputMbd / 46, 0.72, 1.32)
    const rawContribution =
      (routeDependencePct / 100) *
      (lensSignal / 100) *
      bypassDrag *
      controlFactor *
      structuralFactor *
      throughputFactor
    const contributionScore = clamp(
      Math.round(
        lensSignal * 0.5 +
          routeDependencePct * 0.2 +
          controlEffectiveScorePct * 0.15 +
          (point.score ?? 0) * 0.15,
      ),
      8,
      98,
    )

    return {
      id: `${lensId}-${point.id}`,
      lensId,
      chokepointId: point.id,
      chokepointName: point.name,
      contributionScore,
      rawContribution,
      routeDependencePct,
      rawRouteSharePct,
      pipelineBypassPct: bypassPct,
      lngImportExposurePct,
      portConcentrationScore,
      controlBy: point.controlBy,
      controlMode: point.controlMode,
      controlEffectiveScorePct,
      controlThresholdPct,
      controlMarginPct,
      chokepointScore: point.score,
      pressureBand: point.band,
      transitMbd: throughputMbd,
      dataBasis: point.dataBasis,
      dataSource: point.dataSource,
      dataAsOf: point.dataAsOf,
      controlNarrative: point.controlNarrative,
      outcomes: point.outcomes,
    }
  })

  const totalRawContribution =
    rawReasonRows.reduce((sum, reason) => sum + reason.rawContribution, 0) || 1

  return rawReasonRows
    .map((reason) => {
      const contributionPct = clamp(
        Math.round((reason.rawContribution / totalRawContribution) * 100),
        1,
        100,
      )
      const topSignals = reason.outcomes
        .slice()
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map((outcome) => `${outcome.label} ${outcome.score}/100`)
        .join(' | ')

      return {
        id: reason.id,
        lensId: reason.lensId,
        chokepointId: reason.chokepointId,
        chokepointName: reason.chokepointName,
        contributionPct,
        contributionScore: reason.contributionScore,
        routeDependencePct: reason.routeDependencePct,
        rawRouteSharePct: reason.rawRouteSharePct,
        pipelineBypassPct: reason.pipelineBypassPct,
        lngImportExposurePct: reason.lngImportExposurePct,
        portConcentrationScore: reason.portConcentrationScore,
        controlBy: reason.controlBy,
        controlMode: reason.controlMode,
        controlEffectiveScorePct: reason.controlEffectiveScorePct,
        controlThresholdPct: reason.controlThresholdPct,
        controlMarginPct: reason.controlMarginPct,
        chokepointScore: reason.chokepointScore,
        pressureBand: reason.pressureBand,
        transitMbd: reason.transitMbd,
        dataBasis: reason.dataBasis,
        dataSource: reason.dataSource,
        dataAsOf: reason.dataAsOf,
        controlNarrative: reason.controlNarrative,
        summary: `${reason.chokepointName} drives ${contributionPct}% of this lens pressure (effective route dependence ${reason.routeDependencePct}%, control ${reason.controlEffectiveScorePct}/100 vs threshold ${reason.controlThresholdPct}/100).`,
        evidenceLine: `Raw route share ${reason.rawRouteSharePct}% | pipeline bypass ${reason.pipelineBypassPct}% | LNG exposure ${reason.lngImportExposurePct}% | throughput ${reason.transitMbd.toFixed(1)} mb/d`,
        signalLine: topSignals,
      }
    })
    .sort((a, b) => b.contributionPct - a.contributionPct)
}

function buildLensDetail({
  id,
  label,
  selectedCountryName,
  effect,
  selectedPoint,
  noShockLine,
  hasPrimaryShock,
  reasons,
}) {
  if (!hasPrimaryShock) {
    return {
      id,
      label,
      score: effect.score,
      band: effect.band,
      confidence: effect.confidence,
      dataBasis: effect.dataBasis,
      dataSource: effect.dataSource,
      verdict: `${selectedCountryName}: no active route-control shock for ${label.toLowerCase()} in this setup.`,
      why: [noShockLine],
      reasonCount: 0,
      reasons: [],
      topReason: null,
    }
  }

  const topReason = reasons[0] ?? null
  const pointDriverLine = selectedPoint
    ? `${selectedPoint.name}: modeled route exposure ${selectedPoint.modelledImportShare}% for this country.`
    : noShockLine

  return {
    id,
    label,
    score: effect.score,
    band: effect.band,
    confidence: effect.confidence,
    dataBasis: effect.dataBasis,
    dataSource: effect.dataSource,
    verdict: `${selectedCountryName}: ${label.toLowerCase()} shows ${effect.effect} (${effect.score}/100, ${effect.band.toLowerCase()}).`,
    why: [effect.summary, topReason?.summary ?? pointDriverLine],
    reasonCount: reasons.length,
    reasons,
    topReason,
  }
}

export function buildCountryEffects({
  effectPoints,
  selectedCountryId,
  selectedEffectPointId,
}) {
  const selectedCountry = countriesById[selectedCountryId]
  const selectedCountryName = selectedCountry?.name ?? 'Selected country'
  const selectedPoint =
    effectPoints.find((point) => point.id === selectedEffectPointId) ??
    effectPoints[0] ??
    null
  const profile = getCountrySecondaryProfile(selectedCountryId)
  const primary = computePrimaryScores(effectPoints, selectedPoint)
  const hasPrimaryShock = effectPoints.length > 0

  const fuelRetailScore =
    primary.energyImportScore * profile.fuelPassThrough.value
  const freightScore =
    primary.shippingRouteScore * profile.freightPassThrough.value
  const macroAmplifier = 1 + profile.currencyPassThrough.value * 0.28
  const policyDampener = clamp(
    1 -
      profile.policyBufferScore.value * 0.18 -
      profile.strategicReserveDays.value / 1200,
    0.72,
    1.03,
  )
  const inflationScore =
    (fuelRetailScore * 0.58 + freightScore * 0.42) *
    profile.inflationSensitivity.value *
    1.55 *
    macroAmplifier *
    policyDampener
  const manufacturingScore =
    (primary.shippingRouteScore * 0.56 + primary.energyImportScore * 0.44) *
    profile.manufacturingSensitivity.value *
    (1 + profile.currencyPassThrough.value * 0.16) *
    (1 - profile.policyBufferScore.value * 0.08)
  const electricityScore =
    primary.energyImportScore *
    (profile.gasPowerSharePct.value / 100) *
    profile.electricityPassThrough.value *
    2.1 *
    (1 - profile.policyBufferScore.value * 0.12)

  const primaryEffects = [
    buildEffectItem({
      id: 'primary-energy-import',
      type: 'primary',
      label: 'Energy import shock',
      score: primary.energyImportScore,
      basis: combineBasisTag([primary.routeBasis]),
      source: primary.routeSource,
      summary:
        primary.routeDependence > 0
          ? `${selectedCountryName} route dependence: ${primary.routeDependence}% on exposed energy corridors.`
          : 'No active chokepoint-driven energy route shock.',
    }),
    buildEffectItem({
      id: 'primary-shipping-route',
      type: 'primary',
      label: 'Shipping detour shock',
      score: primary.shippingRouteScore,
      basis: combineBasisTag([primary.routeBasis]),
      source: primary.routeSource,
      summary: 'Transit risk lifts freight rates and war-risk insurance premiums.',
    }),
  ]

  const secondaryEffects = [
    buildEffectItem({
      id: 'secondary-fuel-retail',
      type: 'secondary',
      label: 'Retail fuel prices',
      score: fuelRetailScore,
      basis: combineBasisTag([primary.routeBasis, profile.fuelPassThrough.basis]),
      source: `${profile.fuelPassThrough.source} | ${primary.routeSource}`,
      summary: 'Pump fuel reflects imported crude and refining-margin shocks.',
    }),
    buildEffectItem({
      id: 'secondary-freight',
      type: 'secondary',
      label: 'Freight cost pressure',
      score: freightScore,
      basis: combineBasisTag([
        primary.routeBasis,
        profile.freightPassThrough.basis,
      ]),
      source: `${profile.freightPassThrough.source} | ${primary.routeSource}`,
      summary: 'Detours and marine insurance premiums raise landed cargo costs.',
    }),
    buildEffectItem({
      id: 'secondary-inflation',
      type: 'secondary',
      label: 'Inflation pressure',
      score: inflationScore,
      basis: combineBasisTag([
        primary.routeBasis,
        profile.inflationSensitivity.basis,
        profile.currencyPassThrough.basis,
        profile.policyBufferScore.basis,
      ]),
      source: `${profile.inflationSensitivity.source} | ${profile.currencyPassThrough.source} | ${profile.policyBufferScore.source} | ${profile.strategicReserveDays.source} | ${primary.routeSource}`,
      summary:
        `CPI pass-through rises with lag; policy buffer ${Math.round(profile.policyBufferScore.value * 100)}/100 and reserve cover ${profile.strategicReserveDays.value} days dampen part of the shock.`,
    }),
    buildEffectItem({
      id: 'secondary-manufacturing',
      type: 'secondary',
      label: 'Manufacturing/logistics stress',
      score: manufacturingScore,
      basis: combineBasisTag([
        primary.routeBasis,
        profile.manufacturingSensitivity.basis,
      ]),
      source: `${profile.manufacturingSensitivity.source} | ${primary.routeSource}`,
      summary: 'Transport volatility increases input delays and inventory stress.',
    }),
    buildEffectItem({
      id: 'secondary-electricity',
      type: 'secondary',
      label: 'Electricity tariff impact',
      score: electricityScore,
      basis: combineBasisTag([
        primary.routeBasis,
        profile.gasPowerSharePct.basis,
        profile.electricityPassThrough.basis,
      ]),
      source: `${profile.gasPowerSharePct.source} | ${profile.electricityPassThrough.source}`,
      summary:
        profile.gasPowerSharePct.value <= 8
          ? `Limited effect because gas is only ${profile.gasPowerSharePct.value}% of power generation.`
          : `Gas power share ${profile.gasPowerSharePct.value}% increases tariff transmission risk.`,
    }),
  ]

  const topSecondary = secondaryEffects
    .slice()
    .sort((a, b) => b.score - a.score)[0]
  const fuelRetail = secondaryEffects.find(
    (effect) => effect.id === 'secondary-fuel-retail',
  )
  const freight = secondaryEffects.find((effect) => effect.id === 'secondary-freight')
  const inflation = secondaryEffects.find(
    (effect) => effect.id === 'secondary-inflation',
  )
  const manufacturing = secondaryEffects.find(
    (effect) => effect.id === 'secondary-manufacturing',
  )
  const electricity = secondaryEffects.find(
    (effect) => effect.id === 'secondary-electricity',
  )

  const immediateHorizonScore = clamp(
    Math.round(
      Math.max(primary.energyImportScore, primary.shippingRouteScore),
    ),
    0,
    98,
  )
  const nearTermHorizonScore = clamp(
    Math.round(average([fuelRetail?.score ?? 0, freight?.score ?? 0])),
    0,
    98,
  )
  const laggedHorizonScore = clamp(
    Math.round(
      average([
        inflation?.score ?? 0,
        manufacturing?.score ?? 0,
        electricity?.score ?? 0,
      ]),
    ),
    0,
    98,
  )

  const horizonCards = hasPrimaryShock
    ? [
        {
          id: 'immediate',
          label: 'Immediate',
          window: '0-14 days',
          score: immediateHorizonScore,
          band: scoreBand(immediateHorizonScore),
          summary: `${toSignalLine('Energy', primary.energyImportScore, scoreBand(primary.energyImportScore))} | ${toSignalLine('Shipping', primary.shippingRouteScore, scoreBand(primary.shippingRouteScore))}`,
        },
        {
          id: 'near-term',
          label: 'Near-term',
          window: '2-8 weeks',
          score: nearTermHorizonScore,
          band: scoreBand(nearTermHorizonScore),
          summary: `${toSignalLine('Retail fuel', fuelRetail?.score ?? 0, fuelRetail?.band ?? 'Low')} | ${toSignalLine('Freight', freight?.score ?? 0, freight?.band ?? 'Low')}`,
        },
        {
          id: 'lagged',
          label: 'Lagged',
          window: '1-6 months',
          score: laggedHorizonScore,
          band: scoreBand(laggedHorizonScore),
          summary: `${toSignalLine('Inflation', inflation?.score ?? 0, inflation?.band ?? 'Low')} | ${toSignalLine('Industry', manufacturing?.score ?? 0, manufacturing?.band ?? 'Low')} | ${toSignalLine('Electricity', electricity?.score ?? 0, electricity?.band ?? 'Low')}`,
        },
      ]
    : [
        {
          id: 'immediate',
          label: 'Immediate',
          window: '0-14 days',
          score: 6,
          band: scoreBand(6),
          summary: 'No disruptable chokepoint transmission in this setup.',
        },
        {
          id: 'near-term',
          label: 'Near-term',
          window: '2-8 weeks',
          score: 8,
          band: scoreBand(8),
          summary: 'Fuel and freight pass-through remains limited.',
        },
        {
          id: 'lagged',
          label: 'Lagged',
          window: '1-6 months',
          score: 10,
          band: scoreBand(10),
          summary: 'Macro downstream pressure remains low.',
        },
      ]

  const immediateSummary = hasPrimaryShock
    ? `${selectedCountryName}: ${topSecondary.label} is the strongest pass-through (${topSecondary.score}/100, ${topSecondary.band.toLowerCase()}).`
    : `${selectedCountryName}: no controllable chokepoint shock detected, so downstream effects remain limited.`

  const oneLineSummary = hasPrimaryShock
    ? `${selectedCountryName}: route shock active (${Math.max(primary.energyImportScore, primary.shippingRouteScore)}/100) with fastest pass-through in ${topSecondary.label.toLowerCase()} (${topSecondary.score}/100).`
    : `${selectedCountryName}: no active route-control shock in this war setup.`

  const noShockLine =
    'No currently disruptable chokepoint in this war setup, so route-pressure transmission stays low.'
  const effectById = Object.fromEntries(
    [...primaryEffects, ...secondaryEffects].map((effect) => [effect.id, effect]),
  )
  const lensDefinitions = [
    {
      id: 'oil',
      label: 'Oil import shock',
      effectId: 'primary-energy-import',
    },
    {
      id: 'petrol',
      label: 'Petrol/Diesel prices',
      effectId: 'secondary-fuel-retail',
    },
    {
      id: 'freight',
      label: 'Freight/logistics',
      effectId: 'secondary-freight',
    },
    {
      id: 'inflation',
      label: 'Inflation pressure',
      effectId: 'secondary-inflation',
    },
    {
      id: 'electricity',
      label: 'Electricity tariff impact',
      effectId: 'secondary-electricity',
    },
    {
      id: 'industry',
      label: 'Industry/logistics stress',
      effectId: 'secondary-manufacturing',
    },
  ]
  const reasonContributionsByLens = Object.fromEntries(
    lensDefinitions.map((lens) => [
      lens.id,
      buildReasonContributions({
        lensId: lens.id,
        effectPoints,
      }),
    ]),
  )
  const selectableLenses = lensDefinitions
    .map((lens) => {
      const effect = effectById[lens.effectId]

      if (!effect) {
        return null
      }

      return buildLensDetail({
        id: lens.id,
        label: lens.label,
        selectedCountryName,
        effect,
        selectedPoint,
        noShockLine,
        hasPrimaryShock,
        reasons: reasonContributionsByLens[lens.id] ?? [],
      })
    })
    .filter(Boolean)
  const highestLens = selectableLenses.reduce((top, current) => {
    if (!top || current.score > top.score) {
      return current
    }

    return top
  }, null)
  const impactLensOptions = [
    { id: 'highest', label: 'Highest impact' },
    ...selectableLenses.map((lens) => ({ id: lens.id, label: lens.label })),
  ]
  const impactLenses = Object.fromEntries(
    selectableLenses.map((lens) => [lens.id, lens]),
  )

  if (highestLens && hasPrimaryShock) {
    impactLenses.highest = {
      ...highestLens,
      id: 'highest',
      label: 'Highest impact',
      verdict: `${selectedCountryName}: highest exposed channel is ${highestLens.label.toLowerCase()} (${highestLens.score}/100, ${highestLens.band.toLowerCase()}).`,
    }
  } else {
    impactLenses.highest = {
      id: 'highest',
      label: 'Highest impact',
      score: 6,
      band: 'Low',
      confidence: 'Low',
      dataBasis: 'modelled',
      dataSource: 'No currently disruptable chokepoint in this scenario.',
      verdict: `${selectedCountryName}: no active route-control shock detected in this setup.`,
      why: [noShockLine],
      reasonCount: 0,
      reasons: [],
      topReason: null,
    }
  }

  reasonContributionsByLens.highest = impactLenses.highest.reasons ?? []

  return {
    oneLineSummary,
    immediateSummary,
    horizonCards,
    primaryEffects,
    secondaryEffects,
    impactLensOptions,
    impactLenses,
    defaultImpactLensId: 'highest',
    reasonContractVersion: 1,
    reasonContributionsByLens,
    dataAsOf: countrySecondarySnapshot.asOf,
    dataSources: countrySecondarySnapshot.sources,
  }
}
