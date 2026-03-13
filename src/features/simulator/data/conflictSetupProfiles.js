export const conflictModes = [
  {
    id: 'blockade',
    label: 'Naval blockade',
    summary:
      'Interdiction-focused conflict posture with the strongest direct maritime disruption.',
    controlBoost: 0.12,
    thresholdShift: -0.05,
    channelMultipliers: {
      trade: 1.08,
      energy: 1.18,
      shipping: 1.34,
      strategic: 1.06,
    },
    routeShockMultiplier: 1.2,
  },
  {
    id: 'sanctions',
    label: 'Sanctions war',
    summary:
      'Policy and market-access pressure with weaker physical route-denial capability.',
    controlBoost: -0.04,
    thresholdShift: 0.08,
    channelMultipliers: {
      trade: 1.28,
      energy: 1.08,
      shipping: 0.94,
      strategic: 1.22,
    },
    routeShockMultiplier: 0.9,
  },
  {
    id: 'strikes',
    label: 'Missile strikes',
    summary:
      'Intermittent kinetic disruption affecting risk premia and corridor reliability.',
    controlBoost: 0.05,
    thresholdShift: -0.01,
    channelMultipliers: {
      trade: 1.02,
      energy: 1.16,
      shipping: 1.14,
      strategic: 1.14,
    },
    routeShockMultiplier: 1.12,
  },
  {
    id: 'proxy',
    label: 'Proxy escalation',
    summary:
      'Indirect disruptions via partner forces and non-state pressure along key routes.',
    controlBoost: 0.06,
    thresholdShift: 0.01,
    channelMultipliers: {
      trade: 1.04,
      energy: 1.1,
      shipping: 1.18,
      strategic: 1.2,
    },
    routeShockMultiplier: 1.1,
  },
  {
    id: 'cyber-logistics',
    label: 'Cyber logistics',
    summary:
      'Port, routing, and scheduling disruption with moderate physical chokepoint impact.',
    controlBoost: 0.02,
    thresholdShift: 0.03,
    channelMultipliers: {
      trade: 1.14,
      energy: 0.98,
      shipping: 1.2,
      strategic: 1.1,
    },
    routeShockMultiplier: 1.03,
  },
]

export const conflictDurations = [
  {
    id: '2w',
    label: '2 weeks',
    summary: 'Short shock window with limited cumulative route attrition.',
    months: 0.5,
    intensityMultiplier: 0.93,
    controlBoost: -0.01,
    thresholdShift: 0.02,
    routeShockMultiplier: 0.9,
  },
  {
    id: '2m',
    label: '2 months',
    summary: 'Sustained disruption period with compounding logistics pressure.',
    months: 2,
    intensityMultiplier: 1.03,
    controlBoost: 0.03,
    thresholdShift: -0.01,
    routeShockMultiplier: 1.05,
  },
  {
    id: '6m',
    label: '6 months',
    summary:
      'Extended conflict horizon with deep rerouting, insurance, and inventory effects.',
    months: 6,
    intensityMultiplier: 1.16,
    controlBoost: 0.07,
    thresholdShift: -0.03,
    routeShockMultiplier: 1.14,
  },
]

export function getConflictModeById(conflictModeId) {
  return (
    conflictModes.find((mode) => mode.id === conflictModeId) ?? conflictModes[0]
  )
}

export function getConflictDurationById(durationId) {
  return (
    conflictDurations.find((duration) => duration.id === durationId) ??
    conflictDurations[1]
  )
}
