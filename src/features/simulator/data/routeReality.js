import { chokepointsById, countriesById } from './network.js'
import {
  getConflictDurationById,
  getConflictModeById,
} from './conflictSetupProfiles.js'

export const routeDataSnapshot = {
  asOf: '2026-03-14',
  summary:
    'Observed oil-route inputs are blended with explicit model assumptions where country-level route shares are not published directly.',
  sources: [
    {
      id: 'eia-chokepoints-2025',
      label: 'U.S. EIA World Oil Transit Chokepoints (updated Jan 2026)',
      url: 'https://www.eia.gov/international/analysis/special-topics/World_Oil_Transit_Chokepoints',
    },
    {
      id: 'eia-india-2025',
      label: 'U.S. EIA India Country Analysis Brief (updated May 2025)',
      url: 'https://www.eia.gov/international/analysis/country/IND',
    },
    {
      id: 'eia-japan-2025',
      label: 'U.S. EIA Japan Country Analysis Brief (updated Apr 2025)',
      url: 'https://www.eia.gov/international/analysis/country/JPN',
    },
    {
      id: 'yonhap-korea-2024',
      label: 'Yonhap / KNOC 2023 crude imports by origin (published Jun 2024)',
      url: 'https://en.yna.co.kr/view/AEN20240628003800320',
    },
    {
      id: 'cgep-china-2026',
      label:
        "Columbia CGEP summary of China's 2025 customs-based Middle East crude intake",
      url: 'https://www.energypolicy.columbia.edu/implications-of-the-conflict-in-the-middle-east-for-chinas-energy-security/',
    },
  ],
}

export const chokepointOilTransitMbd = {
  hormuz: 20.9,
  malacca: 23.2,
  suez: 8.8,
  'bab-el-mandeb': 8.8,
  bosporus: 3.7,
}

const observedRouteDependence = {
  india: {
    hormuz: {
      sharePct: 37,
      basis: 'observed-inferred',
      source:
        'EIA India brief: Middle East share 45% (2023), converted with Hormuz transit factor 0.82.',
    },
  },
  china: {
    hormuz: {
      sharePct: 40,
      basis: 'observed-inferred',
      source:
        'CGEP 2025 summary: Middle East share about 54% (GAC + Kpler), converted with Hormuz transit factor 0.74.',
    },
  },
  japan: {
    hormuz: {
      sharePct: 76,
      basis: 'observed-inferred',
      source:
        'EIA Japan brief: Middle East share 93% (2022), converted with Hormuz transit factor 0.82.',
    },
  },
  'south-korea': {
    hormuz: {
      sharePct: 58,
      basis: 'observed-inferred',
      source:
        'KNOC 2023 data via Yonhap: Middle East share 71.9%, converted with Hormuz transit factor 0.81.',
    },
  },
  'united-states': {
    hormuz: {
      sharePct: 7,
      basis: 'observed',
      source:
        'EIA Today in Energy (Jun 2025): 7% of U.S. crude and condensate imports moved through Hormuz in 1Q25.',
    },
  },
}

const chokepointControlProfiles = {
  hormuz: {
    threshold: 0.58,
    controllers: [
      {
        countryId: 'iran',
        mode: 'direct',
        score: 0.95,
        note: 'Littoral state with direct coercive leverage in the strait.',
      },
      {
        countryId: 'united-states',
        mode: 'indirect',
        score: 0.52,
        note: 'Blue-water naval projection can shape access under escalation.',
      },
      {
        countryId: 'saudi-arabia',
        mode: 'adjacent',
        score: 0.34,
        note: 'Regional military leverage without direct territorial control.',
      },
    ],
  },
  suez: {
    threshold: 0.72,
    controllers: [
      {
        countryId: 'egypt',
        mode: 'direct',
        score: 0.97,
        note: 'Canal operator with sovereign control authority.',
      },
      {
        countryId: 'israel',
        mode: 'indirect',
        score: 0.34,
        note: 'Regional conflict spillover can constrain shipping conditions.',
      },
      {
        countryId: 'united-states',
        mode: 'indirect',
        score: 0.29,
        note: 'Naval escort posture can alter risk perception and throughput.',
      },
    ],
  },
  malacca: {
    threshold: 0.7,
    controllers: [
      {
        countryId: 'singapore',
        mode: 'direct-adjacent',
        score: 0.86,
        note: 'Critical littoral actor in traffic management and surveillance.',
      },
      {
        countryId: 'united-states',
        mode: 'indirect',
        score: 0.36,
        note: 'Maritime security projection without strait sovereignty.',
      },
      {
        countryId: 'china',
        mode: 'indirect',
        score: 0.32,
        note: 'Commercial/naval weight influences congestion and rerouting risk.',
      },
    ],
  },
  bosporus: {
    threshold: 0.75,
    controllers: [
      {
        countryId: 'turkey',
        mode: 'direct',
        score: 0.97,
        note: 'Sovereign control over Turkish Straits passage regime.',
      },
      {
        countryId: 'russia',
        mode: 'indirect',
        score: 0.33,
        note: 'Black Sea military pressure can affect traffic risk and insurance.',
      },
    ],
  },
  'bab-el-mandeb': {
    threshold: 0.6,
    controllers: [
      {
        countryId: 'egypt',
        mode: 'indirect',
        score: 0.49,
        note: 'Red Sea security role and convoy posture can affect throughput.',
      },
      {
        countryId: 'saudi-arabia',
        mode: 'indirect',
        score: 0.44,
        note: 'Regional naval reach and littoral coordination influence risk.',
      },
      {
        countryId: 'iran',
        mode: 'proxy',
        score: 0.45,
        note: 'Proxy-linked disruption risk can pressure insurance and routing.',
      },
      {
        countryId: 'united-states',
        mode: 'indirect',
        score: 0.46,
        note: 'Escorted shipping posture can affect operational constraints.',
      },
      {
        countryId: 'israel',
        mode: 'indirect',
        score: 0.37,
        note: 'Regional conflict expansion can raise maritime risk levels.',
      },
    ],
  },
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function modelRouteShare(countryId, chokepointId) {
  const country = countriesById[countryId]

  if (!country) {
    return {
      sharePct: 0,
      basis: 'modelled',
      source: 'No country profile available.',
    }
  }

  const exposure = country.chokepointExposure[chokepointId] ?? 0
  const shippingFactor = (country.shippingSensitivity ?? 0) / 100
  const sharePct = clamp(Math.round(exposure * 5.2 + shippingFactor * 9), 1, 64)

  return {
    sharePct,
    basis: 'modelled',
    source:
      'Continuumm structural fallback based on chokepoint exposure and shipping sensitivity.',
  }
}

export function getCountryRouteDependence(countryId, chokepointId) {
  const observed = observedRouteDependence[countryId]?.[chokepointId]

  if (observed) {
    return {
      ...observed,
      sharePct: clamp(Math.round(observed.sharePct), 1, 95),
    }
  }

  return modelRouteShare(countryId, chokepointId)
}

export function getConflictChokepointControl({
  aggressorId,
  defenderId,
  chokepointId,
  intensity,
  conflictModeId,
  durationId,
}) {
  const profile = chokepointControlProfiles[chokepointId]
  const chokepointName = chokepointsById[chokepointId]?.name ?? chokepointId
  const conflictMode = getConflictModeById(conflictModeId)
  const duration = getConflictDurationById(durationId)

  if (!profile) {
    return {
      chokepointId,
      chokepointName,
      canDisrupt: false,
      effectiveScore: 0,
      threshold: 1,
      controllerId: null,
      controllerName: 'None',
      mode: 'none',
      note: 'No control profile configured for this chokepoint.',
      transitMbd: chokepointOilTransitMbd[chokepointId] ?? 0,
      narrative:
        'No control profile configured, so this route is treated as non-disruptable.',
    }
  }

  const participants = new Set([aggressorId, defenderId])
  const candidateControllers = profile.controllers.filter((controller) =>
    participants.has(controller.countryId),
  )

  if (!candidateControllers.length) {
    return {
      chokepointId,
      chokepointName,
      canDisrupt: false,
      effectiveScore: 0,
      threshold: profile.threshold,
      controllerId: null,
      controllerName: 'None',
      mode: 'none',
      note: 'Neither belligerent has route-control capability in this model.',
      transitMbd: chokepointOilTransitMbd[chokepointId] ?? 0,
      narrative:
        'No belligerent in the selected pair has sufficient route-control capability for this chokepoint.',
    }
  }

  const strongest = candidateControllers.sort((a, b) => b.score - a.score)[0]
  const intensityBoost = clamp((intensity - 45) / 220, 0, 0.24)
  const effectiveScore = clamp(
    strongest.score +
      intensityBoost +
      conflictMode.controlBoost +
      duration.controlBoost,
    0,
    0.99,
  )
  const effectiveThreshold = clamp(
    profile.threshold + conflictMode.thresholdShift + duration.thresholdShift,
    0.4,
    0.95,
  )
  const canDisrupt = effectiveScore >= effectiveThreshold
  const controllerName =
    countriesById[strongest.countryId]?.name ?? strongest.countryId
  const effectivePct = Math.round(effectiveScore * 100)
  const thresholdPct = Math.round(effectiveThreshold * 100)

  return {
    chokepointId,
    chokepointName,
    canDisrupt,
    effectiveScore,
    threshold: effectiveThreshold,
    controllerId: strongest.countryId,
    controllerName,
    mode: strongest.mode,
    note: strongest.note,
    conflictModeId: conflictMode.id,
    conflictModeLabel: conflictMode.label,
    durationId: duration.id,
    durationLabel: duration.label,
    transitMbd: chokepointOilTransitMbd[chokepointId] ?? 0,
    narrative: canDisrupt
      ? `${controllerName} has ${strongest.mode} chokepoint leverage (${effectivePct}/100), above the disruption threshold (${thresholdPct}/100) for ${conflictMode.label.toLowerCase()} over ${duration.label.toLowerCase()}.`
      : `${controllerName} has ${strongest.mode} leverage (${effectivePct}/100), below the disruption threshold (${thresholdPct}/100) for ${conflictMode.label.toLowerCase()} over ${duration.label.toLowerCase()}.`,
  }
}

export function getConflictControlMap({
  aggressorId,
  defenderId,
  intensity,
  conflictModeId,
  durationId,
}) {
  return Object.fromEntries(
    Object.keys(chokepointsById).map((chokepointId) => [
      chokepointId,
      getConflictChokepointControl({
        aggressorId,
        defenderId,
        chokepointId,
        intensity,
        conflictModeId,
        durationId,
      }),
    ]),
  )
}
