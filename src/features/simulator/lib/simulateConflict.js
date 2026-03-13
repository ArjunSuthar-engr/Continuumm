import {
  chokepoints,
  chokepointsById,
  countries,
  countriesById,
  focusModes,
} from '../data/network.js'

const driverLabels = {
  energy: 'energy price shock',
  shipping: 'shipping detours',
  strategic: 'strategic alignment strain',
  trade: 'trade rerouting',
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function scoreBand(score) {
  if (score >= 78) {
    return 'Severe'
  }

  if (score >= 58) {
    return 'High'
  }

  if (score >= 38) {
    return 'Elevated'
  }

  return 'Watch'
}

function buildNarrative(country, aggressor, defender, drivers, blocked) {
  const blockedNames = blocked.map((item) => item.name)
  const opening = `${country.name} is pressured by ${drivers[0].label}`
  const secondDriver = drivers[1] ? ` and ${drivers[1].label}` : ''

  if (blockedNames.length === 0) {
    return `${opening}${secondDriver} as tension between ${aggressor.name} and ${defender.name} tightens network slack.`
  }

  return `${opening}${secondDriver}, especially if ${blockedNames.join(', ')} are disrupted.`
}

export function simulateConflict({
  aggressorId,
  defenderId,
  focusModeId,
  intensity,
  blockedChokepointIds,
}) {
  const aggressor = countriesById[aggressorId]
  const defender = countriesById[defenderId]
  const focusMode =
    focusModes.find((mode) => mode.id === focusModeId) ?? focusModes[0]
  const blockedChokepoints = blockedChokepointIds
    .map((id) => chokepointsById[id])
    .filter(Boolean)
  const intensityFactor = intensity / 100

  const results = countries
    .filter((country) => country.id !== aggressorId && country.id !== defenderId)
    .map((country) => {
      const tradeExposure =
        ((country.tradeLinks[aggressorId] ?? 0) +
          (country.tradeLinks[defenderId] ?? 0)) *
        3.6
      const directEnergyExposure =
        ((country.energyLinks[aggressorId] ?? 0) +
          (country.energyLinks[defenderId] ?? 0)) *
        4.8
      const chokepointEnergyExposure = blockedChokepoints.reduce(
        (sum, chokepoint) =>
          sum + (chokepoint.exposures[country.id] ?? 0) * 1.65,
        0,
      )
      const shippingExposure =
        country.shippingSensitivity * 1.15 +
        blockedChokepoints.reduce(
          (sum, chokepoint) =>
            sum + (country.chokepointExposure[chokepoint.id] ?? 0) * 1.9,
          0,
        )
      const strategicExposure =
        ((country.strategicLinks[aggressorId] ?? 0) +
          (country.strategicLinks[defenderId] ?? 0)) *
          3.1 +
        ([aggressor.region, defender.region].includes(country.region) ? 7 : 0)

      const channelScores = {
        trade: tradeExposure * focusMode.weights.trade,
        energy:
          (directEnergyExposure + chokepointEnergyExposure) *
          focusMode.weights.energy,
        shipping: shippingExposure * focusMode.weights.shipping,
        strategic: strategicExposure * focusMode.weights.strategic,
      }

      const rawScore = Object.values(channelScores).reduce(
        (sum, value) => sum + value,
        0,
      )
      const resilienceModifier = 1 - country.resilience / 220
      const totalScore = clamp(
        Math.round(rawScore * intensityFactor * resilienceModifier),
        8,
        96,
      )

      const drivers = Object.entries(channelScores)
        .map(([id, value]) => ({
          id,
          value,
          label: driverLabels[id],
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 2)

      return {
        ...country,
        band: scoreBand(totalScore),
        breakdown: channelScores,
        drivers,
        narrative: buildNarrative(
          country,
          aggressor,
          defender,
          drivers,
          blockedChokepoints,
        ),
        totalScore,
      }
    })
    .sort((a, b) => b.totalScore - a.totalScore)

  const channelPressure = {
    trade: Math.round(
      results.reduce((sum, item) => sum + item.breakdown.trade, 0) /
        results.length /
        1.5,
    ),
    energy: Math.round(
      results.reduce((sum, item) => sum + item.breakdown.energy, 0) /
        results.length /
        1.5,
    ),
    shipping: Math.round(
      results.reduce((sum, item) => sum + item.breakdown.shipping, 0) /
        results.length /
        1.3,
    ),
    strategic: Math.round(
      results.reduce((sum, item) => sum + item.breakdown.strategic, 0) /
        results.length /
        1.2,
    ),
  }

  const topAffected = results.slice(0, 5)
  const topScore =
    topAffected.reduce((sum, item) => sum + item.totalScore, 0) /
    topAffected.length
  const averageScore =
    results.reduce((sum, item) => sum + item.totalScore, 0) / results.length
  const totalPressure = blockedChokepoints.reduce(
    (sum, chokepoint) => sum + chokepoint.pressure,
    0,
  )

  const summary = {
    averageScore: Math.round(averageScore),
    detourMiles: Math.round(
      blockedChokepoints.length * 1400 + totalPressure * 65 + intensity * 14,
    ),
    fuelPressure: clamp(
      Math.round(channelPressure.energy * 1.2 + totalPressure * 0.65),
      12,
      98,
    ),
    systemicStress:
      topScore >= 72
        ? 'Systemic'
        : topScore >= 52
          ? 'Spreading'
          : 'Contained',
  }

  return {
    aggressor,
    defender,
    focusMode,
    blockedChokepoints,
    chokepoints,
    countries,
    results,
    topAffected,
    channelPressure,
    summary,
  }
}
