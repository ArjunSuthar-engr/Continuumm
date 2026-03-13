import { chokepointsById, countriesById } from '../data/network.js'
import {
  getConflictDurationById,
  getConflictModeById,
} from '../data/conflictSetupProfiles.js'
import {
  chokepointOilTransitMbd,
  getConflictChokepointControl,
  getCountryRouteDependence,
  routeDataSnapshot,
} from '../data/routeReality.js'

const effectTemplates = {
  hormuz: [
    { id: 'crude', label: 'Crude import costs', weight: 1.25 },
    { id: 'gasoline', label: 'Petrol and diesel retail prices', weight: 1.08 },
    { id: 'lng', label: 'LNG and power-fuel procurement', weight: 0.94 },
  ],
  suez: [
    { id: 'freight', label: 'Container and tanker freight costs', weight: 1.12 },
    { id: 'delivery', label: 'Import delivery lead times', weight: 1.05 },
    { id: 'insurance', label: 'Shipping insurance premiums', weight: 0.92 },
  ],
  malacca: [
    { id: 'freight', label: 'Eastbound shipping throughput', weight: 1.14 },
    { id: 'components', label: 'Industrial component supply timing', weight: 1.01 },
    { id: 'fuel', label: 'Asian fuel cargo rerouting costs', weight: 0.9 },
  ],
  'bab-el-mandeb': [
    { id: 'insurance', label: 'Red Sea insurance risk premium', weight: 1.1 },
    { id: 'detour', label: 'Cape detour freight escalation', weight: 1.06 },
    { id: 'energy', label: 'Refined-fuel shipping costs', weight: 0.93 },
  ],
  bosporus: [
    { id: 'black-sea', label: 'Black Sea cargo bottlenecks', weight: 1.02 },
    { id: 'grain', label: 'Commodity and grain transit pressure', weight: 0.96 },
    { id: 'freight', label: 'Regional tanker and barge rates', weight: 0.88 },
  ],
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function scoreBand(score) {
  if (score >= 72) {
    return 'High'
  }

  if (score >= 46) {
    return 'Elevated'
  }

  return 'Watch'
}

function pressurePhrase(score) {
  if (score >= 74) {
    return 'sharp upward pressure'
  }

  if (score >= 50) {
    return 'clear upward pressure'
  }

  return 'mild upward pressure'
}

function outcomeScore(pointScore, weight) {
  return clamp(Math.round(pointScore * weight), 8, 98)
}

export function buildEffectPoints({
  aggressorId,
  defenderId,
  intensity,
  conflictModeId,
  durationId,
  selectedCountryId,
  blockedChokepointIds,
}) {
  const selectedCountry = countriesById[selectedCountryId]
  const aggressor = countriesById[aggressorId]
  const defender = countriesById[defenderId]
  const conflictMode = getConflictModeById(conflictModeId)
  const duration = getConflictDurationById(durationId)
  const blocked = [...new Set(blockedChokepointIds)]

  if (!selectedCountry || !aggressor || !defender) {
    return []
  }

  const scored = blocked
    .map((chokepointId) => {
      const chokepoint = chokepointsById[chokepointId]

      if (!chokepoint) {
        return null
      }

      const routeDependence = getCountryRouteDependence(
        selectedCountryId,
        chokepoint.id,
      )
      const control = getConflictChokepointControl({
        aggressorId,
        defenderId,
        chokepointId: chokepoint.id,
        intensity,
        conflictModeId: conflictMode.id,
        durationId: duration.id,
      })

      if (!control.canDisrupt) {
        return null
      }

      const corridorExposure = chokepoint.exposures[selectedCountryId] ?? 0
      const corridorDependency = selectedCountry.chokepointExposure[chokepoint.id] ?? 0
      const routeShare = routeDependence.sharePct
      const routeThroughput = chokepointOilTransitMbd[chokepoint.id] ?? 0
      const observedWeight =
        routeDependence.basis === 'observed'
          ? 1.14
          : routeDependence.basis === 'observed-inferred'
            ? 1.08
            : 1
      const controlScore = control.effectiveScore * 100
      const warLinkExposure =
        (chokepoint.exposures[aggressorId] ?? 0) +
        (chokepoint.exposures[defenderId] ?? 0)
      const score = clamp(
        Math.round(
          chokepoint.pressure * 1.06 +
            routeShare * 1.03 * observedWeight +
            corridorExposure * 2.35 +
            corridorDependency * 2.65 +
            routeThroughput * 1.4 +
            warLinkExposure * 1.2 +
            controlScore * 0.38 +
            intensity * 0.2,
        ),
        5,
        98,
      )
      const adjustedScore = clamp(
        Math.round(
          score * conflictMode.routeShockMultiplier * duration.routeShockMultiplier,
        ),
        5,
        98,
      )
      const modelledImportShare = clamp(Math.round(routeShare), 1, 95)
      const templates =
        effectTemplates[chokepoint.id] ?? [
          { id: 'market', label: 'Commodity and freight pricing', weight: 1 },
        ]
      const outcomes = templates.map((template) => {
        const magnitude = outcomeScore(
          adjustedScore,
          template.weight + modelledImportShare / 260,
        )

        return {
          id: template.id,
          label: template.label,
          score: magnitude,
          effect: pressurePhrase(magnitude),
        }
      })

      return {
        id: chokepoint.id,
        name: chokepoint.name,
        note: chokepoint.note,
        coordinates: chokepoint.coordinates,
        blocked: true,
        score: adjustedScore,
        band: scoreBand(adjustedScore),
        modelledImportShare,
        outcomes,
        dataBasis: routeDependence.basis,
        dataSource: routeDependence.source,
        dataAsOf: routeDataSnapshot.asOf,
        controlBy: control.controllerName,
        controlMode: control.mode,
        controlNarrative: control.narrative,
        transitMbd: control.transitMbd,
        whyLine: `${selectedCountry.name} has ${modelledImportShare}% oil-route dependence through ${chokepoint.name}, and ${control.controllerName} can disrupt this corridor under ${conflictMode.label.toLowerCase()} over ${duration.label.toLowerCase()}.`,
      }
    })
    .filter(Boolean)

  return scored
    .sort((a, b) => b.score - a.score)
    .map((point, index) => ({
      ...point,
      rank: index + 1,
    }))
}
