import { chokepoints, countriesById } from '../data/network.js'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function includesPair(aggressorId, defenderId, countryA, countryB) {
  return (
    (aggressorId === countryA && defenderId === countryB) ||
    (aggressorId === countryB && defenderId === countryA)
  )
}

function regionalBoost(chokepoint, aggressor, defender) {
  const middleEastIds = new Set(['Gulf', 'Red Sea', 'Eastern Mediterranean'])
  const belligerents = [aggressor, defender]
  const hasMiddleEastBelligerent = belligerents.some(
    (country) => country?.region === 'Middle East',
  )
  const hasEasternMedBelligerent = belligerents.some(
    (country) => country?.region === 'Eastern Mediterranean',
  )

  if (
    (hasMiddleEastBelligerent || hasEasternMedBelligerent) &&
    middleEastIds.has(chokepoint.region)
  ) {
    return 8
  }

  return 0
}

function scoreChokepoint(chokepoint, aggressor, defender, intensity) {
  const directExposure =
    (chokepoint.exposures[aggressor.id] ?? 0) +
    (chokepoint.exposures[defender.id] ?? 0)
  const corridorDependency =
    (aggressor.chokepointExposure[chokepoint.id] ?? 0) +
    (defender.chokepointExposure[chokepoint.id] ?? 0)
  const networkExposure =
    Object.values(chokepoint.exposures)
      .sort((a, b) => b - a)
      .slice(0, 4)
      .reduce((sum, value) => sum + value, 0) / 4

  return (
    chokepoint.pressure +
    directExposure * 3.1 +
    corridorDependency * 2.2 +
    networkExposure * 1.6 +
    intensity * 0.16 +
    regionalBoost(chokepoint, aggressor, defender)
  )
}

export function deriveConflictChokepoints({
  aggressorId,
  defenderId,
  intensity,
}) {
  if (includesPair(aggressorId, defenderId, 'united-states', 'iran')) {
    return chokepoints.map((chokepoint) => chokepoint.id)
  }

  const aggressor = countriesById[aggressorId]
  const defender = countriesById[defenderId]

  if (!aggressor || !defender) {
    return []
  }

  const scored = chokepoints
    .map((chokepoint) => ({
      id: chokepoint.id,
      score: scoreChokepoint(chokepoint, aggressor, defender, intensity),
    }))
    .sort((a, b) => b.score - a.score)

  const targetCount = clamp(Math.round(intensity / 20), 2, chokepoints.length)

  return scored.slice(0, targetCount).map((item) => item.id)
}
