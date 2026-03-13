export const mapRouteLayerTypes = [
  {
    id: 'lng',
    short: 'LNG',
    label: 'LNG corridors',
    description: 'Gas cargo lanes that translate route shocks into power/fertilizer costs.',
  },
  {
    id: 'pipeline',
    short: 'PL',
    label: 'Pipeline corridors',
    description: 'Bypass routes that can dampen or reroute maritime disruption.',
  },
  {
    id: 'ports',
    short: 'PT',
    label: 'Major ports',
    description: 'High-throughput gateways where rerouting pressure is absorbed.',
  },
  {
    id: 'insurance',
    short: 'IN',
    label: 'Insurance risk zones',
    description: 'War-risk premium areas amplifying shipping and landed-cost pressure.',
  },
]

export const mapRouteLayers = {
  lng: [
    {
      id: 'lng-qatar-india',
      name: 'Qatar LNG -> India west coast',
      positions: [
        [25.3, 51.5],
        [23.2, 58.0],
        [20.7, 72.9],
      ],
      relatedChokepoints: ['hormuz'],
      primaryImpact:
        'LNG cargo costs and spot procurement stress rise when Hormuz disruption risk climbs.',
      secondaryImpact:
        'Power and fertilizer input costs can drift upward if replacement cargoes are expensive.',
    },
    {
      id: 'lng-qatar-japan',
      name: 'Qatar LNG -> East Asia',
      positions: [
        [25.3, 51.5],
        [2.6, 101.0],
        [34.6, 135.2],
      ],
      relatedChokepoints: ['hormuz', 'malacca'],
      primaryImpact:
        'Combined Hormuz and Malacca stress lifts delivered LNG cost and schedule uncertainty.',
      secondaryImpact:
        'Gas-heavy power systems face faster retail-electricity cost transmission.',
    },
    {
      id: 'lng-redsea-europe',
      name: 'LNG Red Sea -> Mediterranean route',
      positions: [
        [12.7, 43.3],
        [30.5, 32.3],
        [37.6, 3.0],
      ],
      relatedChokepoints: ['bab-el-mandeb', 'suez'],
      primaryImpact:
        'Red Sea and Suez instability increases detour risk for LNG and refined-fuel shipping.',
      secondaryImpact:
        'European balancing costs rise and spill into global spot LNG pricing.',
    },
  ],
  pipeline: [
    {
      id: 'pipeline-russia-china',
      name: 'Russia -> China pipeline corridor',
      positions: [
        [62.2, 101.5],
        [53.2, 107.0],
        [43.8, 121.0],
      ],
      relatedChokepoints: ['hormuz', 'malacca'],
      primaryImpact:
        'Pipeline intake can partially offset seaborne crude disruption for China.',
      secondaryImpact:
        'Bypass capacity lowers extreme price spikes but does not neutralize shipping shocks.',
    },
    {
      id: 'pipeline-caspian-turkey',
      name: 'Caspian -> Turkey transit',
      positions: [
        [40.4, 49.8],
        [39.9, 44.5],
        [39.0, 35.2],
      ],
      relatedChokepoints: ['bosporus', 'suez'],
      primaryImpact:
        'Regional pipelines reduce pressure on Bosporus passage under Black Sea stress.',
      secondaryImpact:
        'Transit rerouting still adds basis-risk and freight volatility for nearby markets.',
    },
  ],
  ports: [
    {
      id: 'port-jnpt',
      name: 'JNPT / Nhava Sheva',
      coordinates: [18.95, 72.95],
      relatedChokepoints: ['hormuz', 'bab-el-mandeb'],
      primaryImpact:
        'Import scheduling and demurrage risk rise when Gulf and Red Sea corridors tighten.',
      secondaryImpact:
        'Landed fuel and component costs can pass through to domestic wholesale prices.',
    },
    {
      id: 'port-singapore',
      name: 'Port of Singapore',
      coordinates: [1.25, 103.9],
      relatedChokepoints: ['malacca', 'hormuz'],
      primaryImpact:
        'Rerouting concentrates tanker and container queues around the Malacca gateway.',
      secondaryImpact:
        'Regional freight indices and bunker costs climb quickly during prolonged disruption.',
    },
    {
      id: 'port-rotterdam',
      name: 'Port of Rotterdam',
      coordinates: [51.95, 4.13],
      relatedChokepoints: ['suez', 'bab-el-mandeb'],
      primaryImpact:
        'Europe-Asia route stress via Suez shifts arrival windows and raises voyage costs.',
      secondaryImpact:
        'Industrial input price pressure grows as inventory buffers are consumed.',
    },
  ],
  insurance: [
    {
      id: 'insurance-red-sea',
      name: 'Red Sea war-risk envelope',
      center: [16.5, 41.8],
      radiusKm: 900,
      relatedChokepoints: ['bab-el-mandeb', 'suez'],
      primaryImpact:
        'War-risk insurance premiums increase voyage cost across Red Sea and Suez-linked paths.',
      secondaryImpact:
        'Higher insurance and escort costs feed into freight and consumer price pressure.',
    },
    {
      id: 'insurance-gulf',
      name: 'Gulf war-risk envelope',
      center: [25.5, 55.5],
      radiusKm: 700,
      relatedChokepoints: ['hormuz'],
      primaryImpact:
        'Risk premia around Hormuz raise tanker charter rates and crude landed costs.',
      secondaryImpact:
        'Fuel retail pass-through accelerates in import-dependent economies.',
    },
  ],
}
