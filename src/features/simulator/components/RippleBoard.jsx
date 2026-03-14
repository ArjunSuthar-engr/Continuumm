import { Fragment, useMemo, useState } from 'react'
import {
  Circle,
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useTheme } from '../../../components/layout/themeContext'
import {
  mapRouteLayers,
  mapRouteLayerTypes,
} from '../data/mapRouteLayers.js'

function RippleBoard({
  scenario,
  blockedChokepointIds,
  effectPoints,
  focusedReasons,
  activeImpactLensId,
  activeImpactLensLabel,
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
  const topFocusedReason = focusedReasons[0] ?? null
  const reasonByChokepointId = useMemo(
    () =>
      Object.fromEntries(
        focusedReasons.map((reason) => [reason.chokepointId, reason]),
      ),
    [focusedReasons],
  )
  const focusedReasonSet = useMemo(
    () => new Set(focusedReasons.map((reason) => reason.chokepointId)),
    [focusedReasons],
  )
  const [visibleLayers, setVisibleLayers] = useState(() =>
    Object.fromEntries(mapRouteLayerTypes.map((layer) => [layer.id, true])),
  )
  const [selectedLayerInsight, setSelectedLayerInsight] = useState(null)

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

  const routeLayerStyles = {
    active: {
      color: theme === 'light' ? '#ba6d38' : '#ffbf7a',
      opacity: 0.86,
      weight: 2.8,
      fillOpacity: 0.2,
    },
    linked: {
      color: theme === 'light' ? '#51799c' : '#8fb8d6',
      opacity: 0.72,
      weight: 2.5,
      fillOpacity: 0.16,
    },
    inactive: {
      color: theme === 'light' ? '#6289aa' : '#8ab3d2',
      opacity: 0.54,
      weight: 2.1,
      fillOpacity: 0.12,
    },
    ineligible: {
      color: theme === 'light' ? '#8ea0ae' : '#6f8497',
      opacity: 0.32,
      weight: 1.7,
      fillOpacity: 0.08,
    },
  }

  const layerStateById = useMemo(() => {
    const blockedSet = new Set(blockedChokepointIds)
    const selectedPointId = activeEffectPoint?.id

    const items = [
      ...mapRouteLayers.lng.map((item) => ({ ...item, layerType: 'lng' })),
      ...mapRouteLayers.pipeline.map((item) => ({
        ...item,
        layerType: 'pipeline',
      })),
      ...mapRouteLayers.ports.map((item) => ({ ...item, layerType: 'ports' })),
      ...mapRouteLayers.insurance.map((item) => ({
        ...item,
        layerType: 'insurance',
      })),
    ]

    return Object.fromEntries(
      items.map((item) => {
        const related = item.relatedChokepoints ?? []
        const isActive = selectedPointId && related.includes(selectedPointId)
        const isReasonLinked = related.some((id) => focusedReasonSet.has(id))
        const isEligible = related.some((id) => blockedSet.has(id))

        return [
          item.id,
          isActive
            ? 'active'
            : isReasonLinked
              ? 'linked'
              : isEligible
                ? 'inactive'
                : 'ineligible',
        ]
      }),
    )
  }, [activeEffectPoint?.id, blockedChokepointIds, focusedReasonSet])

  function toggleLayer(layerId) {
    setVisibleLayers((current) => ({
      ...current,
      [layerId]: !current[layerId],
    }))
  }

  function buildLayerInsight(item, state) {
    const stateLine =
      state === 'active'
        ? `Active signal: this route is directly linked to the selected chokepoint (${activeEffectPoint?.name ?? 'current point'}).`
        : state === 'linked'
          ? `Effect-linked signal: this route is part of the selected effect pathway (${activeImpactLensLabel.toLowerCase()}).`
        : state === 'inactive'
          ? 'Watchlist signal: this route is linked to a controllable chokepoint, but it is not the currently selected node.'
          : 'Ineligible signal: linked chokepoints are currently not disruptable by this war pair.'

    return {
      id: item.id,
      name: item.name,
      type: item.layerType,
      state,
      countryId: selectedCountryId,
      effectPointId: selectedEffectPointId,
      impactLensId: activeImpactLensId,
      lines: [item.primaryImpact, item.secondaryImpact, `${selectedCountryName}: ${stateLine}`],
    }
  }

  function handleLayerClick(item) {
    const state = layerStateById[item.id] ?? 'ineligible'
    setSelectedLayerInsight(buildLayerInsight(item, state))
  }
  const displayedLayerInsight =
    selectedLayerInsight?.countryId === selectedCountryId &&
    selectedLayerInsight?.effectPointId === selectedEffectPointId &&
    selectedLayerInsight?.impactLensId === activeImpactLensId
      ? selectedLayerInsight
      : null

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
          route control. Active effect pathway: {activeImpactLensLabel}. Linked
          chokepoints glow with an outer ring.
        </p>
      </div>

      <div className="board-shell p-4 sm:p-5">
        <div className="world-map-shell">
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

            {visibleLayers.lng
              ? mapRouteLayers.lng.map((corridor) => {
                  const state = layerStateById[corridor.id] ?? 'ineligible'
                  const style = routeLayerStyles[state]
                  const layerItem = { ...corridor, layerType: 'lng' }

                  return (
                    <Polyline
                      key={corridor.id}
                      positions={corridor.positions}
                      pathOptions={{
                        color: style.color,
                        opacity: style.opacity,
                        weight: style.weight,
                        dashArray: state === 'ineligible' ? '4 8' : '8 6',
                      }}
                      eventHandlers={{
                        click: () => handleLayerClick(layerItem),
                      }}
                    >
                      <Tooltip
                        permanent={state === 'active'}
                        direction="top"
                        offset={[0, -2]}
                        className="world-map-tooltip"
                      >
                        LNG | {corridor.name}
                      </Tooltip>
                    </Polyline>
                  )
                })
              : null}

            {visibleLayers.pipeline
              ? mapRouteLayers.pipeline.map((corridor) => {
                  const state = layerStateById[corridor.id] ?? 'ineligible'
                  const style = routeLayerStyles[state]
                  const layerItem = { ...corridor, layerType: 'pipeline' }

                  return (
                    <Polyline
                      key={corridor.id}
                      positions={corridor.positions}
                      pathOptions={{
                        color: style.color,
                        opacity: style.opacity,
                        weight: style.weight,
                        dashArray: state === 'ineligible' ? '2 8' : '',
                      }}
                      eventHandlers={{
                        click: () => handleLayerClick(layerItem),
                      }}
                    >
                      <Tooltip
                        permanent={state === 'active'}
                        direction="top"
                        offset={[0, -2]}
                        className="world-map-tooltip"
                      >
                        Pipeline | {corridor.name}
                      </Tooltip>
                    </Polyline>
                  )
                })
              : null}

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
              const linkedReason = reasonByChokepointId[point.id] ?? null
              const isReasonLinked = focusedReasonSet.has(point.id)
              const style = pointBandStyles[point.band] ?? pointBandStyles.Watch
              const ringColor = theme === 'light' ? '#ba6d38' : '#ffbf7a'
              const radius = isSelected
                ? 8.8
                : isReasonLinked
                  ? Math.min(8.2, 5.2 + point.score / 28)
                  : Math.min(7.8, 4.6 + point.score / 30)

              return (
                <Fragment key={point.id}>
                  {isReasonLinked ? (
                    <Circle
                      center={[point.coordinates.lat, point.coordinates.lng]}
                      radius={200000 + (linkedReason?.contributionPct ?? 0) * 2200}
                      pathOptions={{
                        color: ringColor,
                        opacity: isSelected ? 0.74 : 0.52,
                        weight: isSelected ? 2.2 : 1.5,
                        fillOpacity: 0,
                      }}
                    />
                  ) : null}
                  <CircleMarker
                    center={[point.coordinates.lat, point.coordinates.lng]}
                    radius={radius}
                    pathOptions={{
                      color: style.color,
                      fillColor: style.color,
                      fillOpacity: isReasonLinked ? 0.98 : 0.92,
                      weight: isSelected ? 2.7 : isReasonLinked ? 2.25 : isHighlighted ? 2 : 1.2,
                    }}
                    eventHandlers={{
                      click: () => onSelectChokepoint(point.id),
                    }}
                  >
                    <Tooltip
                      permanent={isSelected || isReasonLinked || point.rank <= 2}
                      direction="right"
                      offset={[6, 0]}
                      className="world-map-tooltip"
                    >
                      {point.name} | {point.band}
                      {linkedReason ? ` | ${linkedReason.contributionPct}%` : ''}
                    </Tooltip>
                  </CircleMarker>
                </Fragment>
              )
            })}

            {visibleLayers.ports
              ? mapRouteLayers.ports.map((port) => {
                  const state = layerStateById[port.id] ?? 'ineligible'
                  const style = routeLayerStyles[state]
                  const layerItem = { ...port, layerType: 'ports' }

                  return (
                    <CircleMarker
                      key={port.id}
                      center={port.coordinates}
                      radius={
                        state === 'active'
                          ? 7.2
                          : state === 'linked'
                            ? 6.8
                            : state === 'inactive'
                              ? 6.2
                              : 5.2
                      }
                      pathOptions={{
                        color: style.color,
                        fillColor: style.color,
                        fillOpacity: state === 'active' ? 0.9 : state === 'linked' ? 0.78 : style.opacity,
                        weight: state === 'active' ? 2.2 : state === 'linked' ? 1.9 : 1.4,
                      }}
                      eventHandlers={{
                        click: () => handleLayerClick(layerItem),
                      }}
                    >
                      <Tooltip
                        permanent={state === 'active' || state === 'linked'}
                        direction="left"
                        offset={[-4, 0]}
                        className="world-map-tooltip"
                      >
                        Port | {port.name}
                      </Tooltip>
                    </CircleMarker>
                  )
                })
              : null}

            {visibleLayers.insurance
              ? mapRouteLayers.insurance.map((zone) => {
                  const state = layerStateById[zone.id] ?? 'ineligible'
                  const style = routeLayerStyles[state]
                  const layerItem = { ...zone, layerType: 'insurance' }

                  return (
                    <Circle
                      key={zone.id}
                      center={zone.center}
                      radius={zone.radiusKm * 1000}
                      pathOptions={{
                        color: style.color,
                        opacity: style.opacity,
                        weight: state === 'active' ? 2.2 : state === 'linked' ? 1.9 : 1.4,
                        fillColor: style.color,
                        fillOpacity: style.fillOpacity,
                        dashArray: state === 'ineligible' ? '4 10' : '6 8',
                      }}
                      eventHandlers={{
                        click: () => handleLayerClick(layerItem),
                      }}
                    >
                      <Tooltip
                        permanent={state === 'active' || state === 'linked'}
                        direction="center"
                        className="world-map-tooltip"
                      >
                        Insurance | {zone.name}
                      </Tooltip>
                    </Circle>
                  )
                })
              : null}
          </MapContainer>
        </div>

        <div className="map-context-stack mt-4">
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
              <strong className="stat-chip-value">
                {scenario.topAffected[0]?.name ?? selectedCountryName}
              </strong>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-label">Effect-linked points</span>
              <strong className="stat-chip-value">{focusedReasons.length}</strong>
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
            <article className="point-legend-item">
              <span className="point-legend-dot point-legend-dot-reason" />
              <span>Reason-linked point for selected effect</span>
            </article>
          </div>

          <div className="map-impact-legend">
            <article className="impact-legend-item">
              <span className="impact-legend-swatch impact-legend-swatch-primary" />
              <span>Primary signal: route/corridor transmission</span>
            </article>
            <article className="impact-legend-item">
              <span className="impact-legend-swatch impact-legend-swatch-secondary" />
              <span>Secondary signal: domestic downstream impact</span>
            </article>
            <article className="impact-legend-item">
              <span className="impact-legend-swatch impact-legend-swatch-reason" />
              <span>Selected-effect linkage pathway</span>
            </article>
          </div>

          <div className="map-layer-toggle-grid">
            {mapRouteLayerTypes.map((layer) => (
              <button
                key={layer.id}
                type="button"
                className={`map-layer-toggle ${
                  visibleLayers[layer.id] ? 'map-layer-toggle-active' : ''
                }`}
                onClick={() => toggleLayer(layer.id)}
              >
                <span className="map-layer-toggle-code">{layer.short}</span>
                <span className="map-layer-toggle-copy">
                  <strong>{layer.label}</strong>
                  <span>{layer.description}</span>
                </span>
              </button>
            ))}
          </div>
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
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Active effect: <strong>{activeImpactLensLabel}</strong> | linked
                chokepoints: <strong>{focusedReasons.length}</strong>
              </p>
              {topFocusedReason ? (
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Top reason for this effect: {topFocusedReason.chokepointName} (
                  {topFocusedReason.contributionPct}% contribution)
                </p>
              ) : null}
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {selectedCountryName} route dependence here:{' '}
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
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Raw route share {activeEffectPoint.routeShareRawPct}% | pipeline
                bypass {activeEffectPoint.pipelineBypassPct}% | LNG exposure{' '}
                {activeEffectPoint.lngImportExposurePct}% | port concentration{' '}
                {activeEffectPoint.portConcentrationScore}
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

        <article className="mini-panel mt-4">
          <p className="eyebrow">
            {displayedLayerInsight ? 'Route layer insight' : 'Layer click guide'}
          </p>
          {displayedLayerInsight ? (
            <>
              <h3 className="mt-2 text-xl text-stone-100">
                {displayedLayerInsight.name}
              </h3>
              <p className="mono mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                {displayedLayerInsight.type} | {displayedLayerInsight.state}
              </p>
              <div className="mt-3 space-y-2">
                {displayedLayerInsight.lines.map((line) => (
                  <p key={line} className="text-sm leading-6 text-slate-300">
                    {line}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Click any LNG corridor, pipeline line, major port, or insurance zone
              on the map to see how it changes outcomes for {selectedCountryName}.
            </p>
          )}
        </article>
      </div>
    </section>
  )
}

export default RippleBoard
