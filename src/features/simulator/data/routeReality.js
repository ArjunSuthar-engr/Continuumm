import { chokepointsById, countriesById } from './network.js'
import {
  getConflictDurationById,
  getConflictModeById,
} from './conflictSetupProfiles.js'

export const routeDataSnapshot = {
  asOf: '2026-03-14',
  summary:
    'Observed route inputs are blended with explicit model assumptions where country-level route shares are not published directly.',
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
    {
      id: 'unctad-maritime-2025',
      label: 'UNCTAD maritime transport review and route-risk commentary',
      url: 'https://unctad.org/publication/review-maritime-transport',
    },
    {
      id: 'worldbank-logistics-2023',
      label: 'World Bank logistics and trade facilitation indicators',
      url: 'https://lpi.worldbank.org/',
    },
    {
      id: 'iea-gas-2025',
      label: 'IEA Gas market and LNG trade flow context',
      url: 'https://www.iea.org/reports/gas-market-report-q2-2025',
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
    suez: {
      sharePct: 14,
      basis: 'observed-inferred',
      source:
        'UNCTAD Europe-India route mix proxy mapped to Suez transit dependence.',
    },
    'bab-el-mandeb': {
      sharePct: 17,
      basis: 'observed-inferred',
      source:
        'Red Sea transit share inferred from India-Europe and Mediterranean cargo mix.',
    },
    malacca: {
      sharePct: 26,
      basis: 'observed-inferred',
      source:
        'Eastbound crude/product and container routing proxy via Strait of Malacca.',
    },
  },
  china: {
    hormuz: {
      sharePct: 40,
      basis: 'observed-inferred',
      source:
        'CGEP 2025 summary: Middle East share about 54% (GAC + Kpler), converted with Hormuz transit factor 0.74.',
    },
    malacca: {
      sharePct: 61,
      basis: 'observed-inferred',
      source:
        'Eastbound maritime throughput proxy for Malacca in China-bound seaborne imports.',
    },
    suez: {
      sharePct: 9,
      basis: 'observed-inferred',
      source:
        'Europe-China route split proxy mapped to Suez chokepoint share.',
    },
    'bab-el-mandeb': {
      sharePct: 12,
      basis: 'observed-inferred',
      source:
        'Red Sea corridor proxy for China-bound westward routes via Suez.',
    },
  },
  japan: {
    hormuz: {
      sharePct: 76,
      basis: 'observed-inferred',
      source:
        'EIA Japan brief: Middle East share 93% (2022), converted with Hormuz transit factor 0.82.',
    },
    malacca: {
      sharePct: 64,
      basis: 'observed-inferred',
      source:
        'Japan-bound tanker route mix proxy for Malacca and adjacent lanes.',
    },
    'bab-el-mandeb': {
      sharePct: 8,
      basis: 'observed-inferred',
      source: 'Middle East-Europe-East Asia long-route proxy for Bab el-Mandeb.',
    },
  },
  'south-korea': {
    hormuz: {
      sharePct: 58,
      basis: 'observed-inferred',
      source:
        'KNOC 2023 data via Yonhap: Middle East share 71.9%, converted with Hormuz transit factor 0.81.',
    },
    malacca: {
      sharePct: 62,
      basis: 'observed-inferred',
      source:
        'Korea-bound seaborne imports route share proxy through Malacca.',
    },
    suez: {
      sharePct: 7,
      basis: 'observed-inferred',
      source: 'Europe-Korea route mix proxy via Suez corridor.',
    },
  },
  germany: {
    suez: {
      sharePct: 18,
      basis: 'observed-inferred',
      source:
        'Germany-Asia cargo route proxy using Suez-dominant Europe-Asia corridor.',
    },
    'bab-el-mandeb': {
      sharePct: 10,
      basis: 'observed-inferred',
      source:
        'Red Sea segment share inferred from Suez-linked Europe-Asia shipments.',
    },
    bosporus: {
      sharePct: 6,
      basis: 'observed-inferred',
      source:
        'Black Sea import corridor proxy for Bosporus dependency into Europe.',
    },
  },
  turkey: {
    bosporus: {
      sharePct: 23,
      basis: 'observed-inferred',
      source:
        'Black Sea maritime dependence inferred from Turkish Straits transit profile.',
    },
    suez: {
      sharePct: 11,
      basis: 'observed-inferred',
      source:
        'Mediterranean-Red Sea linkage proxy for Turkish route exposure.',
    },
  },
  singapore: {
    malacca: {
      sharePct: 68,
      basis: 'observed-inferred',
      source:
        'Transshipment and bunkering concentration around Malacca-Singapore corridor.',
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

const countryRouteAugmenters = {
  india: {
    pipelineBypassPct: {
      value: 14,
      basis: 'observed-inferred',
      source:
        'Pipeline bypass capacity proxy for import blend and inland distribution.',
    },
    lngImportExposurePct: {
      value: 11,
      basis: 'observed-inferred',
      source: 'IEA LNG share proxy for India gas import balance.',
    },
    portConcentrationScore: {
      value: 0.58,
      basis: 'modelled',
      source:
        'Continuumm concentration score from major-port throughput distribution.',
    },
  },
  china: {
    pipelineBypassPct: {
      value: 26,
      basis: 'observed-inferred',
      source:
        'Pipeline import corridor share proxy (Russia/Central Asia) reducing seaborne reliance.',
    },
    lngImportExposurePct: {
      value: 9,
      basis: 'observed-inferred',
      source: 'IEA LNG share proxy for China gas import profile.',
    },
    portConcentrationScore: {
      value: 0.49,
      basis: 'modelled',
      source: 'Continuumm concentration score from major Chinese port network.',
    },
  },
  japan: {
    pipelineBypassPct: {
      value: 4,
      basis: 'observed',
      source: 'Island system with negligible cross-border pipeline bypass.',
    },
    lngImportExposurePct: {
      value: 36,
      basis: 'observed-inferred',
      source: 'IEA LNG import intensity proxy for Japan.',
    },
    portConcentrationScore: {
      value: 0.71,
      basis: 'modelled',
      source: 'Continuumm port concentration estimate for energy gateways.',
    },
  },
  'south-korea': {
    pipelineBypassPct: {
      value: 3,
      basis: 'observed',
      source: 'Limited cross-border pipeline bypass for seaborne imports.',
    },
    lngImportExposurePct: {
      value: 33,
      basis: 'observed-inferred',
      source: 'IEA LNG reliance proxy for South Korea.',
    },
    portConcentrationScore: {
      value: 0.66,
      basis: 'modelled',
      source: 'Continuumm port concentration estimate for Korean gateways.',
    },
  },
  germany: {
    pipelineBypassPct: {
      value: 32,
      basis: 'observed-inferred',
      source: 'Pipeline and inland corridor proxy reducing seaborne dependence.',
    },
    lngImportExposurePct: {
      value: 18,
      basis: 'observed-inferred',
      source: 'IEA/EU LNG intake proxy for Germany import profile.',
    },
    portConcentrationScore: {
      value: 0.45,
      basis: 'modelled',
      source: 'Continuumm port concentration estimate for North Sea/Baltic access.',
    },
  },
  turkey: {
    pipelineBypassPct: {
      value: 36,
      basis: 'observed-inferred',
      source:
        'Pipeline corridor proxy for Turkey transit and import diversification.',
    },
    lngImportExposurePct: {
      value: 22,
      basis: 'observed-inferred',
      source: 'IEA LNG proxy for Turkish gas supply mix.',
    },
    portConcentrationScore: {
      value: 0.52,
      basis: 'modelled',
      source: 'Continuumm port concentration estimate for Turkish straits access.',
    },
  },
  'united-states': {
    pipelineBypassPct: {
      value: 46,
      basis: 'observed-inferred',
      source:
        'Domestic production and pipeline network proxy for import bypass capability.',
    },
    lngImportExposurePct: {
      value: 8,
      basis: 'observed',
      source: 'Low LNG import exposure due net exporter posture.',
    },
    portConcentrationScore: {
      value: 0.38,
      basis: 'modelled',
      source: 'Continuumm port concentration estimate for diversified coastal access.',
    },
  },
}

const chokepointModalProfiles = {
  hormuz: {
    oilWeight: 1,
    lngWeight: 0.86,
    containerWeight: 0.24,
    pipelineBypassRelevance: 0.72,
  },
  suez: {
    oilWeight: 0.58,
    lngWeight: 0.36,
    containerWeight: 0.94,
    pipelineBypassRelevance: 0.18,
  },
  malacca: {
    oilWeight: 0.82,
    lngWeight: 0.56,
    containerWeight: 0.98,
    pipelineBypassRelevance: 0.24,
  },
  bosporus: {
    oilWeight: 0.46,
    lngWeight: 0.12,
    containerWeight: 0.52,
    pipelineBypassRelevance: 0.38,
  },
  'bab-el-mandeb': {
    oilWeight: 0.64,
    lngWeight: 0.28,
    containerWeight: 0.9,
    pipelineBypassRelevance: 0.2,
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

export function getCountryRouteAugmenters(countryId) {
  const configured = countryRouteAugmenters[countryId]

  if (configured) {
    return configured
  }

  const country = countriesById[countryId]
  const shippingFactor = (country?.shippingSensitivity ?? 42) / 100

  return {
    pipelineBypassPct: {
      value: clamp(Math.round(18 + (country?.resilience ?? 55) * 0.18), 10, 44),
      basis: 'modelled',
      source: 'Continuumm fallback pipeline bypass model from resilience.',
    },
    lngImportExposurePct: {
      value: clamp(Math.round(12 + shippingFactor * 22), 8, 32),
      basis: 'modelled',
      source: 'Continuumm fallback LNG exposure model from shipping profile.',
    },
    portConcentrationScore: {
      value: clamp(Number((0.42 + shippingFactor * 0.28).toFixed(2)), 0.35, 0.78),
      basis: 'modelled',
      source: 'Continuumm fallback port concentration model.',
    },
  }
}

export function getChokepointModalProfile(chokepointId) {
  return (
    chokepointModalProfiles[chokepointId] ?? {
      oilWeight: 0.5,
      lngWeight: 0.24,
      containerWeight: 0.62,
      pipelineBypassRelevance: 0.22,
    }
  )
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
