export const softwareModules = [
  {
    id: 'spillover-core',
    path: '/software/spillover-core',
    index: '/0.1',
    title: 'Spillover Core',
    description:
      'Model second-order impact from one conflict pair into third-country economic and strategic pressure.',
    hero: {
      kicker: 'Spillover Core',
      title:
        'Watch a local war shock propagate into distant economies through connected lanes.',
      summary:
        'This module traces how a selected conflict pair pushes pressure into countries that are not on the battlefield but depend on exposed corridors.',
    },
    signalCards: [
      {
        label: 'Primary question',
        value: 'Who absorbs pressure first?',
        note: 'Ranks third-country exposure from controllable chokepoints and route dependence.',
      },
      {
        label: 'Transmission channels',
        value: 'Trade / Energy / Shipping / Strategic',
        note: 'Scores all four channels before focus weighting is applied.',
      },
      {
        label: 'Output posture',
        value: 'Comparative, not predictive',
        note: 'Shows structural vulnerability and directional stress, not certainty.',
      },
    ],
    flow: [
      {
        code: '01',
        title: 'Set the conflict pair',
        text: 'Choose Country A and Country B, then tune severity, mode, and duration.',
      },
      {
        code: '02',
        title: 'Gate chokepoints by control',
        text: 'Routes activate only where one belligerent can plausibly disrupt transit.',
      },
      {
        code: '03',
        title: 'Score downstream countries',
        text: 'The model pushes route shock into country-level channels and ranks effects.',
      },
    ],
    outcomes: [
      {
        title: 'Fast read',
        text: 'Immediate top-spillover country and headline pressure in one glance.',
      },
      {
        title: 'Traceability',
        text: 'Every high score is tied back to specific chokepoints and route exposure.',
      },
      {
        title: 'Decision value',
        text: 'Supports planning by revealing fragile dependencies before escalation.',
      },
    ],
  },
  {
    id: 'route-pressure',
    path: '/software/route-pressure',
    index: '/0.2',
    title: 'Route Pressure',
    description:
      'Track chokepoint congestion risk across canals and straits that amplify shipping and energy shock.',
    hero: {
      kicker: 'Route Pressure',
      title:
        'Map where corridor disruption converts military tension into trade and fuel stress.',
      summary:
        'This module visualizes control-sensitive chokepoints and route layers so users can see where conflict can bend the global transport geometry.',
    },
    signalCards: [
      {
        label: 'Map focus',
        value: 'Corridors and chokepoints',
        note: 'Highlights maritime and route infrastructure that carries outsized systemic load.',
      },
      {
        label: 'Interactive read',
        value: 'Click to explain impact',
        note: 'Selecting a node reveals concise effects for the chosen country.',
      },
      {
        label: 'Legend clarity',
        value: 'Primary vs secondary paths',
        note: 'Line styles and point colors separate direct shock from propagated effects.',
      },
    ],
    flow: [
      {
        code: '01',
        title: 'Highlight exposed routes',
        text: 'Conflict settings illuminate only chokepoints with plausible disruption leverage.',
      },
      {
        code: '02',
        title: 'Inspect route layers',
        text: 'Turn on LNG, pipeline, major-port, and insurance overlays for context.',
      },
      {
        code: '03',
        title: 'Read causal pathway',
        text: 'Click a point to see how rerouting, premiums, and scarcity ripple outward.',
      },
    ],
    outcomes: [
      {
        title: 'Visual hierarchy',
        text: 'Users can instantly separate high-effect routes from watch-level routes.',
      },
      {
        title: 'Operational context',
        text: 'Layer toggles reveal why a chokepoint matters beyond one shipping line.',
      },
      {
        title: 'Actionable storytelling',
        text: 'Each selected point states what changes and why it changes.',
      },
    ],
  },
  {
    id: 'country-brief',
    path: '/software/country-brief',
    index: '/0.3',
    title: 'Country Brief',
    description:
      'Inspect why one selected country moves, with transparent channel-level pressure drivers.',
    hero: {
      kicker: 'Country Brief',
      title:
        'Shift from global map to one-country consequences with lens-level precision.',
      summary:
        'This module compresses complex spillover into a country-first brief so users can quickly understand likely domestic pressure patterns and drill deeper when needed.',
    },
    signalCards: [
      {
        label: 'User control',
        value: 'Select any target country',
        note: 'The right panel focuses only on the selected country, keeping interpretation sharp.',
      },
      {
        label: 'Impact lenses',
        value: 'Highest / Oil / Petrol / Freight / Inflation',
        note: 'Switch lenses to isolate one pressure channel instead of reading long stacked text.',
      },
      {
        label: 'Progressive depth',
        value: 'Quick -> Explain -> Analyst',
        note: 'Start minimal, then open details only when the user asks for them.',
      },
    ],
    flow: [
      {
        code: '01',
        title: 'Choose the target country',
        text: 'Pick one country in the right panel to lock the analysis context.',
      },
      {
        code: '02',
        title: 'Select an impact lens',
        text: 'Use Highest impact or a specific channel to focus the signal.',
      },
      {
        code: '03',
        title: 'Read direct and secondary effects',
        text: 'See route dependence, downstream pressure, and confidence/basis tags.',
      },
    ],
    outcomes: [
      {
        title: 'Immediate verdict',
        text: 'A one-line answer tells what will likely move first in that country.',
      },
      {
        title: 'Deeper auditability',
        text: 'Expandable details expose underlying channels and horizon windows.',
      },
      {
        title: 'Practical planning',
        text: 'Supports policy, energy, and supply decisions with transparent rationale.',
      },
    ],
  },
]

export function getSoftwareModuleById(id) {
  return softwareModules.find((module) => module.id === id) ?? null
}
