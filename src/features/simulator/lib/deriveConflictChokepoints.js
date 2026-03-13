import { chokepoints, countriesById } from '../data/network.js'
import {
  getConflictDurationById,
  getConflictModeById,
} from '../data/conflictSetupProfiles.js'
import {
  chokepointOilTransitMbd,
  getConflictControlMap,
} from '../data/routeReality.js'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
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

  const transitThroughput = chokepointOilTransitMbd[chokepoint.id] ?? 0

  return (
    chokepoint.pressure +
    directExposure * 3.1 +
    corridorDependency * 2.2 +
    networkExposure * 1.6 +
    transitThroughput * 1.7 +
    intensity * 0.16 +
    regionalBoost(chokepoint, aggressor, defender)
  )
}

export function deriveConflictChokepoints({
  aggressorId,
  defenderId,
  intensity,
  conflictModeId,
  durationId,
}) {
  const aggressor = countriesById[aggressorId]
  const defender = countriesById[defenderId]
  const conflictMode = getConflictModeById(conflictModeId)
  const duration = getConflictDurationById(durationId)

  if (!aggressor || !defender) {
    return []
  }

  const controlMap = getConflictControlMap({
    aggressorId,
    defenderId,
    intensity,
    conflictModeId,
    durationId,
  })

  const scored = chokepoints
    .map((chokepoint) => {
      const control = controlMap[chokepoint.id]
      const structuralScore = scoreChokepoint(
        chokepoint,
        aggressor,
        defender,
        intensity,
      )
      const controlScore = control?.canDisrupt
        ? Math.round(control.effectiveScore * 100)
        : 0

      return {
        id: chokepoint.id,
        canDisrupt: Boolean(control?.canDisrupt),
        score:
          structuralScore * 0.52 +
          controlScore * 0.48 +
          (chokepointOilTransitMbd[chokepoint.id] ?? 0) *
            conflictMode.routeShockMultiplier *
            duration.routeShockMultiplier,
      }
    })
    .filter((item) => item.canDisrupt)
    .sort((a, b) => b.score - a.score)

  if (!scored.length) {
    return []
  }

  const targetCount = clamp(
    Math.round(
      (intensity / 33) *
        conflictMode.routeShockMultiplier *
        duration.routeShockMultiplier,
    ),
    1,
    scored.length,
  )

  return scored.slice(0, targetCount).map((item) => item.id)
}
