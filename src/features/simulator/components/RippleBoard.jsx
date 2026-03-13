import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useTheme } from '../../../components/layout/themeContext'

function RippleBoard({
  scenario,
  blockedChokepointIds,
  effectPoints,
  selectedCountryId,
  onSelectCountry,
  selectedEffectPointId,
  onSelectChokepoint,
}) {
  const { theme } = useTheme()
  const highlightedChokepoints = new Set(blockedChokepointIds)
  const topAffectedIds = new Set(scenario.topAffected.map((country) => country.id))
  const routeCountries = scenario.topAffected.slice(0, 4)
  const selectedCountryName =
    scenario.countries.find((country) => country.id === selectedCountryId)?.name ??
    'Selected country'
  const selectedEffectPoint = effectPoints.find(
    (point) => point.id === selectedEffectPointId,
  )
  const activeEffectPoint = selectedEffectPoint ?? effectPoints[0]

  const tileUrl =
    theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  const lineStyles = {
    conflict: {
      name: 'Conflict transmission',
      note: 'Direct shock path from belligerents into exposed economies.',
      color: theme === 'light' ? '#ad6735' : '#ffb874',
      dashArray: '7 8',
      weight: 2.8,
      opacity: 0.7,
    },
    spillover: {
      name: 'Spillover route',
      note: 'Secondary rerouting and market-pressure propagation channels.',
      color: theme === 'light' ? '#4f7fa4' : '#7baccd',
      dashArray: '4 9',
      weight: 2,
      opacity: 0.55,
    },
  }

  const pointBandStyles = {
    High: {
      color: theme === 'light' ? '#b65934' : '#f18c53',
    },
    Elevated: {
      color: theme === 'light' ? '#5f84a2' : '#7ca8ca',
    },
    Watch: {
      color: theme === 'light' ? '#768d9f' : '#8ca4b6',
    },
  }

  const lines = routeCountries.flatMap((country) => {
    const fromAggressor = scenario.aggressor.coordinates
    const fromDefender = scenario.defender.coordinates
    const destination = country.coordinates

    if (!fromAggressor || !fromDefender || !destination) {
      return []
    }

    return [
      {
        id: `${scenario.aggressor.id}-${country.id}`,
        type: 'conflict',
        positions: [
          [fromAggressor.lat, fromAggressor.lng],
          [destination.lat, destination.lng],
        ],
      },
      {
        id: `${scenario.defender.id}-${country.id}`,
        type: 'spillover',
        positions: [
          [fromDefender.lat, fromDefender.lng],
          [destination.lat, destination.lng],
        ],
      },
    ]
  })

  return (
    <section className="panel overflow-hidden">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Effects map</p>
          <h2 className="panel-title">Global spillover</h2>
        </div>
        <p className="panel-copy">
          Red chokepoints are shown only when this war pair can plausibly disrupt
          route control. Click a point to inspect direct impact pathways.
        </p>
      </div>

      <div className="board-shell p-4 sm:p-5">
        <div className="map-kpi-strip">
          <div className="stat-chip">
            <span className="stat-chip-label">War pair</span>
            <strong className="stat-chip-value">
              {scenario.aggressor.name} vs {scenario.defender.name}
            </strong>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-label">Controllable chokepoints</span>
            <strong className="stat-chip-value">{blockedChokepointIds.length}</strong>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-label">Top spillover</span>
            <strong className="stat-chip-value">{scenario.topAffected[0].name}</strong>
          </div>
        </div>

        <div className="map-line-legend">
          {Object.entries(lineStyles).map(([lineId, lineStyle]) => (
            <article key={lineId} className="line-legend-item">
              <svg
                viewBox="0 0 100 12"
                className="line-legend-swatch"
                aria-hidden="true"
              >
                <line
                  x1="2"
                  y1="6"
                  x2="98"
                  y2="6"
                  stroke={lineStyle.color}
                  strokeWidth={lineStyle.weight}
                  strokeDasharray={lineStyle.dashArray}
                  strokeLinecap="round"
                  opacity={lineStyle.opacity}
                />
              </svg>
              <div className="line-legend-copy">
                <strong>{lineStyle.name}</strong>
                <span>{lineStyle.note}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="map-point-legend">
          <article className="point-legend-item">
            <span className="point-legend-dot point-legend-dot-high" />
            <span>High effect (control + dependence)</span>
          </article>
          <article className="point-legend-item">
            <span className="point-legend-dot point-legend-dot-elevated" />
            <span>Elevated effect (partial dependence)</span>
          </article>
          <article className="point-legend-item">
            <span className="point-legend-dot point-legend-dot-watch" />
            <span>Watch-level effect</span>
          </article>
        </div>

        <div className="world-map-shell mt-4">
          <MapContainer
            center={[22, 18]}
            zoom={2}
            minZoom={2}
            maxZoom={6}
            scrollWheelZoom={true}
            worldCopyJump={true}
            className="world-map-canvas"
          >
            <TileLayer
              url={tileUrl}
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            />

            {lines.map((line) => (
              <Polyline
                key={line.id}
                positions={line.positions}
                pathOptions={{
                  weight: lineStyles[line.type].weight,
                  opacity: lineStyles[line.type].opacity,
                  color: lineStyles[line.type].color,
                  dashArray: lineStyles[line.type].dashArray,
                }}
              />
            ))}

            {scenario.countries.map((country) => {
              if (!country.coordinates) {
                return null
              }

              const isBelligerent =
                country.id === scenario.aggressor.id ||
                country.id === scenario.defender.id
              const isSelected = country.id === selectedCountryId
              const isTopAffected = topAffectedIds.has(country.id)
              const radius = isSelected ? 8 : isBelligerent ? 7 : isTopAffected ? 6 : 5
              const color = isBelligerent
                ? theme === 'light'
                  ? '#91592f'
                  : '#dcb187'
                : isSelected
                  ? theme === 'light'
                    ? '#2f6288'
                    : '#67a7d5'
                  : isTopAffected
                    ? theme === 'light'
                      ? '#4f7fa4'
                      : '#8eb9d5'
                    : theme === 'light'
                      ? '#6f8ca3'
                      : '#8fa7ba'
              const showLabel = isBelligerent || isSelected

              return (
                <CircleMarker
                  key={country.id}
                  center={[country.coordinates.lat, country.coordinates.lng]}
                  radius={radius}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.88,
                    weight: isSelected ? 2.5 : 1.2,
                  }}
                  eventHandlers={{
                    click: () => onSelectCountry(country.id),
                  }}
                >
                  <Tooltip
                    permanent={showLabel}
                    direction="top"
                    offset={[0, -4]}
                    className="world-map-tooltip"
                  >
                    <span className="mono text-[10px] uppercase tracking-[0.2em]">
                      {country.code}
                    </span>{' '}
                    {country.name}
                  </Tooltip>
                </CircleMarker>
              )
            })}

            {effectPoints.map((point) => {
              if (!point.coordinates) {
                return null
              }

              const isHighlighted = highlightedChokepoints.has(point.id)
              const isSelected = point.id === selectedEffectPointId
              const style = pointBandStyles[point.band] ?? pointBandStyles.Watch
              const radius = isSelected
                ? 8.4
                : Math.min(7.8, 4.6 + point.score / 30)

              return (
                <CircleMarker
                  key={point.id}
                  center={[point.coordinates.lat, point.coordinates.lng]}
                  radius={radius}
                  pathOptions={{
                    color: style.color,
                    fillColor: style.color,
                    fillOpacity: 0.92,
                    weight: isSelected ? 2.5 : isHighlighted ? 2 : 1.2,
                  }}
                  eventHandlers={{
                    click: () => onSelectChokepoint(point.id),
                  }}
                >
                  <Tooltip
                    permanent={isSelected || point.rank <= 2}
                    direction="right"
                    offset={[6, 0]}
                    className="world-map-tooltip"
                  >
                    {point.name} | {point.band}
                  </Tooltip>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>

        <article className="mini-panel mt-4">
          <p className="eyebrow">
            {activeEffectPoint ? 'Selected effect point' : 'How to use'}
          </p>
          {activeEffectPoint ? (
            <>
              <h3 className="mt-2 text-2xl text-stone-100">
                {activeEffectPoint.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {selectedCountryName} oil-route dependence:{' '}
                <strong>{activeEffectPoint.modelledImportShare}%</strong> | pressure{' '}
                <strong>{activeEffectPoint.band}</strong> ({activeEffectPoint.score}
                /100)
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Control: {activeEffectPoint.controlNarrative}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Throughput: {activeEffectPoint.transitMbd} mb/d | data basis:{' '}
                {activeEffectPoint.dataBasis} ({activeEffectPoint.dataAsOf})
              </p>
              <div className="mt-3 space-y-2">
                {activeEffectPoint.outcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className="flex items-center justify-between rounded-[8px] border px-3 py-2"
                  >
                    <span className="text-sm text-stone-100">{outcome.label}</span>
                    <span className="mono text-xs text-slate-400">
                      {outcome.effect} | {outcome.score}/100
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {activeEffectPoint.whyLine}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-300">
              This war pair currently has no chokepoint where either belligerent
              crosses the disruption-control threshold.
            </p>
          )}
        </article>
      </div>
    </section>
  )
}

export default RippleBoard
