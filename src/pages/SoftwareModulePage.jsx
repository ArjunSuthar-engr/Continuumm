import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getSoftwareModuleById, softwareModules } from '../data/softwareModules'
import {
  buildCountryEffects,
  buildEffectPoints,
  chokepoints,
  defaultScenarioConfig,
  deriveConflictChokepoints,
  routeDataSnapshot,
  simulateConflict,
} from '../features/simulator'
import { chokepointOilTransitMbd } from '../features/simulator/data/routeReality'

const chokepointsById = Object.fromEntries(
  chokepoints.map((chokepoint) => [chokepoint.id, chokepoint]),
)

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function titleFromId(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function InfoHint({ text }) {
  return (
    <button type="button" className="info-hint" aria-label={text} title={text}>
      i
    </button>
  )
}

function buildSpilloverVisual() {
  const snapshot = simulateConflict(defaultScenarioConfig)
  const topCountries = snapshot.topAffected.slice(0, 6)
  const maxBar = 100
  const topCountry = topCountries[0]

  const downstreamPositions = [
    { x: 18, y: 72 },
    { x: 36, y: 79 },
    { x: 56, y: 76 },
    { x: 74, y: 70 },
  ]
  const downstreamNodes = topCountries.slice(0, 4).map((country, index) => ({
    id: country.id,
    label: country.code,
    x: downstreamPositions[index].x,
    y: downstreamPositions[index].y,
    size: 4.2,
    kind: 'secondary',
  }))
  const warNodes = [
    {
      id: snapshot.aggressor.id,
      label: snapshot.aggressor.code,
      x: 32,
      y: 22,
      size: 5.4,
      kind: 'primary',
    },
    {
      id: snapshot.defender.id,
      label: snapshot.defender.code,
      x: 68,
      y: 22,
      size: 5.4,
      kind: 'primary',
    },
  ]
  const links = downstreamNodes.flatMap((node) => [
    {
      id: `a-${node.id}`,
      from: { x: warNodes[0].x, y: warNodes[0].y },
      to: { x: node.x, y: node.y },
      kind: 'conflict',
    },
    {
      id: `d-${node.id}`,
      from: { x: warNodes[1].x, y: warNodes[1].y },
      to: { x: node.x, y: node.y },
      kind: 'spillover',
    },
  ])

  return {
    heroKicker: 'Spillover Core',
    heroTitle: 'Visualize where pressure travels first',
    heroSummary: 'Conflict source -> chokepoint stress -> third-country score.',
    canvasKicker: 'Transmission map',
    canvasBadges: [
      `${snapshot.aggressor.code} vs ${snapshot.defender.code}`,
      `${topCountry?.name ?? '--'} highest pressure`,
    ],
    info: {
      canvas:
        'Graphic flow of pressure from the selected war pair into top exposed third countries.',
      metrics:
        'Fast summary metrics for this module: who is most exposed and overall stress level.',
      gauge: '0-100 visual stress gauge for the selected module snapshot.',
      chart:
        'Bar chart ranks the strongest entities for this module in the current baseline scenario.',
    },
    nodes: [...warNodes, ...downstreamNodes],
    links,
    metrics: [
      {
        label: 'Top spillover',
        value: topCountry?.name ?? '--',
        hint: 'Country currently ranking highest by modeled structural pressure.',
      },
      {
        label: 'Average score',
        value: snapshot.summary.averageScore,
        unit: '/100',
        hint: 'Average modeled pressure across non-belligerent countries.',
      },
      {
        label: 'Fuel pressure',
        value: snapshot.summary.fuelPressure,
        unit: '/100',
        hint: 'Aggregate energy/fuel pass-through pressure in the current scenario.',
      },
      {
        label: 'System state',
        value: snapshot.summary.systemicStress,
        hint: 'Overall network condition category: Contained, Spreading, or Systemic.',
      },
    ],
    gauge: {
      label: 'Global stress',
      value: snapshot.summary.averageScore,
    },
    barChart: {
      title: 'Top affected countries',
      valueSuffix: '/100',
      bars: topCountries.map((country) => ({
        id: country.id,
        label: country.name,
        value: country.totalScore,
        max: maxBar,
      })),
    },
  }
}

function buildRoutePressureVisual() {
  const activeChokepoints = deriveConflictChokepoints(defaultScenarioConfig)
  const transitBars = Object.entries(chokepointOilTransitMbd)
    .map(([id, mbd]) => ({
      id,
      label: titleFromId(id),
      value: Number(mbd.toFixed(1)),
    }))
    .sort((a, b) => b.value - a.value)
  const maxTransit = Math.max(...transitBars.map((bar) => bar.value), 1)
  const totalTransit = transitBars.reduce((sum, entry) => sum + entry.value, 0)

  const nodes = transitBars.map((entry, index) => {
    const point = chokepointsById[entry.id]?.position ?? {
      x: 14 + index * 16,
      y: 24 + (index % 2) * 14,
    }

    return {
      id: entry.id,
      label: chokepointsById[entry.id]?.name ?? entry.label,
      shortLabel: entry.label,
      x: point.x,
      y: point.y,
      size: clamp(2.8 + (entry.value / maxTransit) * 4.4, 3.2, 7.4),
      kind: activeChokepoints.includes(entry.id) ? 'primary' : 'secondary',
    }
  })
  const links = nodes.slice(0, -1).map((node, index) => ({
    id: `${node.id}-${nodes[index + 1].id}`,
    from: { x: node.x, y: node.y },
    to: { x: nodes[index + 1].x, y: nodes[index + 1].y },
    kind: index % 2 === 0 ? 'conflict' : 'spillover',
  }))

  return {
    heroKicker: 'Route Pressure',
    heroTitle: 'See corridor load, not just country names',
    heroSummary: 'Transit volume + control feasibility = route vulnerability.',
    canvasKicker: 'Chokepoint intensity',
    canvasBadges: [
      `${activeChokepoints.length} disruptable now`,
      `${routeDataSnapshot.sources.length} source sets`,
    ],
    info: {
      canvas:
        'Node map of chokepoints where size reflects transit importance and color reflects disruption eligibility.',
      metrics:
        'Quick route-level metrics for current baseline control and throughput state.',
      gauge:
        'Percentage of tracked chokepoints currently disruptable under the active war setup.',
      chart:
        'Transit volume bars (mbd) show how much oil flow each chokepoint carries.',
    },
    nodes: nodes.map((node) => ({
      ...node,
      label: node.shortLabel,
    })),
    links,
    metrics: [
      {
        label: 'Transit corridors',
        value: transitBars.length,
        hint: 'Total chokepoints tracked in this route-pressure surface.',
      },
      {
        label: 'Disruptable now',
        value: activeChokepoints.length,
        hint: 'Chokepoints currently above control threshold for disruption.',
      },
      {
        label: 'Total transit',
        value: totalTransit.toFixed(1),
        unit: 'mbd',
        hint: 'Combined modeled oil transit volume across tracked chokepoints.',
      },
      {
        label: 'Data as-of',
        value: routeDataSnapshot.asOf,
        hint: 'Latest update date for the route dataset snapshot.',
      },
    ],
    gauge: {
      label: 'Active corridor share',
      value: Math.round((activeChokepoints.length / transitBars.length) * 100),
    },
    barChart: {
      title: 'Oil transit by chokepoint',
      valueSuffix: ' mbd',
      bars: transitBars.map((entry) => ({
        id: entry.id,
        label: entry.label,
        value: entry.value,
        max: maxTransit,
      })),
    },
  }
}

function buildCountryBriefVisual() {
  const blockedChokepointIds = deriveConflictChokepoints(defaultScenarioConfig)
  const effectPoints = buildEffectPoints({
    ...defaultScenarioConfig,
    selectedCountryId: 'india',
    blockedChokepointIds,
  })
  const countryEffects = buildCountryEffects({
    effectPoints,
    selectedCountryId: 'india',
    selectedEffectPointId: effectPoints[0]?.id,
  })
  const strongestLens =
    countryEffects.impactLensOptions
      .filter((option) => option.id !== 'highest')
      .map((option) => ({
        id: option.id,
        label: option.label,
        score: countryEffects.impactLenses[option.id]?.score ?? 0,
      }))
      .sort((a, b) => b.score - a.score)[0] ?? null

  const lensBars = countryEffects.impactLensOptions
    .filter((option) => option.id !== 'highest')
    .map((option) => ({
      id: option.id,
      label: option.label,
      value: countryEffects.impactLenses[option.id]?.score ?? 0,
      max: 100,
    }))
    .sort((a, b) => b.value - a.value)

  const countryNode = {
    id: 'india',
    label: 'IN',
    x: 56,
    y: 56,
    size: 6.6,
    kind: 'primary',
  }
  const routeNodes = effectPoints.slice(0, 4).map((point) => {
    const base = chokepointsById[point.id]?.position ?? { x: 25, y: 30 }

    return {
      id: point.id,
      label: point.id
        .split('-')
        .map((part) => part.charAt(0).toUpperCase())
        .join(''),
      x: base.x,
      y: base.y,
      size: clamp(3.2 + point.score / 22, 3.8, 7.8),
      kind: 'secondary',
    }
  })
  const warNode = {
    id: 'war-pair',
    label: 'IL/IR',
    x: 30,
    y: 18,
    size: 5,
    kind: 'secondary',
  }
  const links = routeNodes.flatMap((node) => [
    {
      id: `war-${node.id}`,
      from: { x: warNode.x, y: warNode.y },
      to: { x: node.x, y: node.y },
      kind: 'conflict',
    },
    {
      id: `in-${node.id}`,
      from: { x: node.x, y: node.y },
      to: { x: countryNode.x, y: countryNode.y },
      kind: 'spillover',
    },
  ])

  return {
    heroKicker: 'Country Brief',
    heroTitle: 'Switch lenses and read one country instantly',
    heroSummary: 'Select country -> choose lens -> read strongest pressure.',
    canvasKicker: 'India sample pathway',
    canvasBadges: [
      `${effectPoints.length} active effect points`,
      `${strongestLens?.label ?? 'No active lens'}`,
    ],
    info: {
      canvas:
        'Pathway map from war pair to chokepoints to selected-country impact surface.',
      metrics:
        'Country-focused summary metrics for the selected sample country in this baseline setup.',
      gauge:
        'Overall 0-100 pressure level for the selected country under highest-impact lens.',
      chart:
        'Lens profile bars compare channel-level impact strengths for one country.',
    },
    nodes: [warNode, ...routeNodes, countryNode],
    links,
    metrics: [
      {
        label: 'Selected country',
        value: 'India',
        hint: 'Country currently used as the sample for this module surface.',
      },
      {
        label: 'Highest lens',
        value: strongestLens?.label ?? '--',
        hint: 'Impact channel currently showing the strongest modeled pressure.',
      },
      {
        label: 'Highest score',
        value: strongestLens?.score ?? 0,
        unit: '/100',
        hint: 'Score for the strongest lens, normalized on a 0-100 scale.',
      },
      {
        label: 'Active points',
        value: effectPoints.length,
        hint: 'Number of chokepoints currently transmitting pressure to this country.',
      },
    ],
    gauge: {
      label: 'Country pressure',
      value: countryEffects.impactLenses.highest?.score ?? 0,
    },
    barChart: {
      title: 'Lens score profile',
      valueSuffix: '/100',
      bars: lensBars,
    },
  }
}

function buildVisualByModuleId(moduleId) {
  if (moduleId === 'spillover-core') {
    return buildSpilloverVisual()
  }

  if (moduleId === 'route-pressure') {
    return buildRoutePressureVisual()
  }

  return buildCountryBriefVisual()
}

function SoftwareModulePage() {
  const { softwareId } = useParams()
  const module = getSoftwareModuleById(softwareId ?? '')

  const visual = useMemo(
    () => (module ? buildVisualByModuleId(module.id) : null),
    [module],
  )

  if (!module || !visual) {
    return <Navigate to="/" replace />
  }

  const siblingModules = softwareModules.filter((item) => item.id !== module.id)

  return (
    <div className="space-y-6">
      <section className="software-detail-hero">
        <p className="software-detail-kicker">{visual.heroKicker}</p>
        <h1 className="software-detail-title">{visual.heroTitle}</h1>
        <p className="software-detail-summary">{visual.heroSummary}</p>
        <div className="software-detail-actions">
          <Link to="/simulator" className="landing-primary">
            Open Simulator
          </Link>
          <Link to="/" className="landing-secondary">
            Back to Home
          </Link>
        </div>
      </section>

      <section className="panel">
        <div className="software-visual-grid">
          <article className="software-canvas-card">
            <div className="software-canvas-head">
              <div className="software-head-with-info">
                <p className="eyebrow">{visual.canvasKicker}</p>
                <InfoHint text={visual.info.canvas} />
              </div>
            </div>

            <div className="software-canvas-stage">
              <svg
                viewBox="0 0 100 100"
                className="software-canvas-svg"
                role="img"
                aria-label={`${module.title} visual graph`}
              >
                {visual.links.map((link) => (
                  <line
                    key={link.id}
                    x1={link.from.x}
                    y1={link.from.y}
                    x2={link.to.x}
                    y2={link.to.y}
                    className={`software-canvas-link ${
                      link.kind === 'conflict'
                        ? 'software-canvas-link-conflict'
                        : 'software-canvas-link-spillover'
                    }`}
                  />
                ))}
                {visual.nodes.map((node) => (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size}
                      className={`software-canvas-node ${
                        node.kind === 'primary'
                          ? 'software-canvas-node-primary'
                          : 'software-canvas-node-secondary'
                      }`}
                    />
                    <text
                      x={node.x}
                      y={node.y + 0.9}
                      textAnchor="middle"
                      className="software-canvas-node-label"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="software-canvas-badges">
                {visual.canvasBadges.map((badge) => (
                  <span key={badge} className="software-canvas-badge">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <article className="software-stat-column">
            <div className="software-head-with-info">
              <p className="eyebrow">Key stats</p>
              <InfoHint text={visual.info.metrics} />
            </div>
            <div className="software-metric-grid">
              {visual.metrics.map((metric) => (
                <article key={metric.label} className="software-metric-card">
                  <div className="software-metric-head">
                    <p className="software-metric-label">{metric.label}</p>
                    {metric.hint ? <InfoHint text={metric.hint} /> : null}
                  </div>
                  <p className="software-metric-value">
                    {metric.value}
                    {metric.unit ? (
                      <span className="software-metric-unit">{metric.unit}</span>
                    ) : null}
                  </p>
                </article>
              ))}
            </div>

            <article className="software-gauge-card">
              <div className="software-metric-head">
                <p className="software-metric-label">{visual.gauge.label}</p>
                <InfoHint text={visual.info.gauge} />
              </div>
              <div className="software-gauge-shell">
                <div
                  className="software-gauge-ring"
                  style={{
                    background: `conic-gradient(var(--theme-accent-strong) ${visual.gauge.value}%, var(--theme-progress-track) 0)`,
                  }}
                >
                  <div className="software-gauge-core">
                    <span className="software-gauge-value">{visual.gauge.value}</span>
                    <span className="software-gauge-unit">/100</span>
                  </div>
                </div>
              </div>
            </article>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="software-chart-head">
          <div className="software-head-with-info">
            <p className="eyebrow">{visual.barChart.title}</p>
            <InfoHint text={visual.info.chart} />
          </div>
        </div>

        <div className="software-bar-grid">
          {visual.barChart.bars.map((bar) => {
            const width = clamp((bar.value / bar.max) * 100, 3, 100)

            return (
              <article key={bar.id} className="software-bar-row">
                <div className="software-bar-head">
                  <p className="software-bar-label">{bar.label}</p>
                  <p className="software-bar-value">
                    {bar.value}
                    <span>{visual.barChart.valueSuffix}</span>
                  </p>
                </div>
                <div className="software-bar-track">
                  <div
                    className="software-bar-fill"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="panel">
        <div className="software-jump-grid">
          {siblingModules.map((item, index) => (
            <Link key={item.id} to={item.path} className="software-jump-card">
              <div className={`software-jump-thumb software-jump-thumb-${index + 1}`}>
                <span>{item.index}</span>
              </div>
              <h3>{item.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default SoftwareModulePage
