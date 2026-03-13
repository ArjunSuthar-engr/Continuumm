export const calibrationSnapshot = {
  asOf: '2026-03-14',
  note:
    'Calibration checkpoints are directional reality checks, not price forecasts.',
  sources: [
    {
      id: 'eia-hormuz-2026',
      label: 'U.S. EIA World Oil Transit Chokepoints (Jan 2026 update)',
      url: 'https://www.eia.gov/international/analysis/special-topics/World_Oil_Transit_Chokepoints',
    },
    {
      id: 'eia-india-2025',
      label: 'U.S. EIA India Country Analysis Brief (May 2025 update)',
      url: 'https://www.eia.gov/international/analysis/country/IND',
    },
    {
      id: 'imf-cpi-2025',
      label: 'IMF inflation transmission context for fuel importers',
      url: 'https://www.imf.org/en/Publications/WEO',
    },
  ],
}

export const simulatorAssumptions = [
  'Chokepoint effects are gated by belligerent control/disruption capability before any country impact is scored.',
  'Route dependence combines observed inputs where available and explicit modelled fallback where direct shares are missing.',
  'Secondary domestic effects are deterministic pass-through transformations of primary route shocks.',
  'Scores are comparative structural pressure indicators (0-100), not direct forecasts of market prices.',
]

export const simulatorLimitations = [
  'Control profiles are simplified and do not model tactical military timelines.',
  'Country route shares use partial observed coverage and inferred proxies for several corridors.',
  'Macroeconomic pass-through coefficients are static and do not yet adapt to policy changes in real time.',
  'The current graph is intentionally compact and not yet full-country global coverage.',
]

export const calibrationEpisodes = [
  {
    id: 'hormuz-india-fuel-sensitivity',
    title: 'Hormuz risk should transmit strongly into India fuel pressure',
    scenarioLabel: 'Israel vs Iran | Naval blockade | 2 months | severity 80',
    summary:
      'If Hormuz is controllably stressed, India should show high fuel pass-through and materially lower electricity impact.',
    thresholds: [
      'Hormuz must appear as a controllable effect point for India.',
      'India effective Hormuz dependence should remain at least 30% in this setup.',
      'Retail fuel pressure should exceed electricity pressure by at least 18 points.',
    ],
    sources: ['eia-hormuz-2026', 'eia-india-2025'],
  },
  {
    id: 'suez-control-threshold-flip',
    title: 'Suez control should flip from limited to eligible across escalation posture',
    scenarioLabel:
      'Israel vs Iran | sanctions+2 weeks+55 vs blockade+6 months+95',
    summary:
      'The same pair should fail Suez disruption under low-control posture and pass under high-control posture.',
    thresholds: [
      'Low posture must stay below Suez disruption threshold.',
      'High posture must exceed Suez disruption threshold.',
      'The control gap between low and high posture should be at least 15 points.',
    ],
    sources: ['eia-hormuz-2026'],
  },
]

