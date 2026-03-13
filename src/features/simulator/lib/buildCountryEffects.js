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

export function buildCountryEffects({
  effectPoints,
  selectedCountryId,
  selectedEffectPointId,
}) {
  const selectedCountry = countriesById[selectedCountryId]
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
          ? `${selectedCountry?.name ?? 'Country'} route dependence around ${primary.routeDependence}% is transmitting crude/LNG pressure.`
          : 'No active chokepoint-driven energy route shock in this setup.',
    }),
    buildEffectItem({
      id: 'primary-shipping-route',
      type: 'primary',
      label: 'Shipping detour shock',
      score: primary.shippingRouteScore,
      basis: combineBasisTag([primary.routeBasis]),
      source: primary.routeSource,
      summary:
        'Transit risk is raising freight and insurance pressure across the selected corridor.',
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
      summary:
        'Petrol and diesel prices absorb imported crude cost and refining-margin shocks.',
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
      summary:
        'Container/tanker rerouting and war-risk insurance feed into landed costs.',
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
        `Fuel and freight pass-through pushes CPI pressure after transport/input lags; policy buffer ${Math.round(profile.policyBufferScore.value * 100)}/100 and reserve cover ${profile.strategicReserveDays.value} days partially absorb shock.`,
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
      summary:
        'Lead-time volatility and transport uncertainty disrupt inventory and production planning.',
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
          ? `Limited effect expected because gas is only ${profile.gasPowerSharePct.value}% of power generation.`
          : `Gas-based generation share at ${profile.gasPowerSharePct.value}% increases electricity-cost transmission risk.`,
    }),
  ]

  const topSecondary = secondaryEffects
    .slice()
    .sort((a, b) => b.score - a.score)[0]

  const immediateSummary = hasPrimaryShock
    ? `${selectedCountry?.name ?? 'Selected country'}: strongest secondary pressure is ${topSecondary.label.toLowerCase()} (${topSecondary.score}/100, ${topSecondary.band.toLowerCase()}).`
    : `${selectedCountry?.name ?? 'Selected country'}: no controllable chokepoint shock in this scenario, so secondary effects remain limited.`

  return {
    immediateSummary,
    primaryEffects,
    secondaryEffects,
    dataAsOf: countrySecondarySnapshot.asOf,
    dataSources: countrySecondarySnapshot.sources,
  }
}
