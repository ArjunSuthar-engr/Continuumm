export const scenarioPresets = [
  {
    id: 'middle-east-escalation',
    label: 'US-Israel-Iran escalation',
    summary:
      'Centers Israel-Iran confrontation with US strategic involvement and chokepoint risk around Hormuz, Bab el-Mandeb, and Suez.',
    config: {
      aggressorId: 'israel',
      defenderId: 'iran',
      focusModeId: 'energy',
      conflictModeId: 'strikes',
      durationId: '2m',
      intensity: 76,
      blockedChokepointIds: ['hormuz', 'bab-el-mandeb', 'suez'],
    },
    contextActorIds: ['united-states', 'india'],
  },
  {
    id: 'indo-pacific-containment',
    label: 'US-China containment',
    summary:
      'Tracks pressure transmission through Pacific trade lanes and Malacca throughput.',
    config: {
      aggressorId: 'china',
      defenderId: 'united-states',
      focusModeId: 'trade',
      conflictModeId: 'sanctions',
      durationId: '6m',
      intensity: 68,
      blockedChokepointIds: ['malacca'],
    },
    contextActorIds: ['india', 'japan', 'south-korea'],
  },
]

export const defaultPresetId = scenarioPresets[0].id
