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
  selectedCountryId,
  onSelectCountry,
  selectedChokepointId,
  onSelectChokepoint,
}) {
  const { theme } = useTheme()
  const highlightedChokepoints = new Set(blockedChokepointIds)
  const topAffectedIds = new Set(scenario.topAffected.map((country) => country.id))
  const routeCountries = scenario.topAffected.slice(0, 4)
  const selectedChokepoint = scenario.chokepoints.find(
    (chokepoint) => chokepoint.id === selectedChokepointId,
  )
  const selectedChokepointImpact = selectedChokepoint
    ? scenario.results
        .map((country) => ({
          ...country,
          chokepointExposure:
            (selectedChokepoint.exposures[country.id] ?? 0) +
            (country.chokepointExposure[selectedChokepoint.id] ?? 0),
        }))
        .filter((country) => country.chokepointExposure > 0)
        .sort((a, b) => b.chokepointExposure - a.chokepointExposure)
        .slice(0, 4)
    : []

  const tileUrl =
    theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

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
          Red chokepoints are under stress for this war pair. Click any chokepoint
          to see which countries it may affect.
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
            <span className="stat-chip-label">Red chokepoints</span>
            <strong className="stat-chip-value">{blockedChokepointIds.length}</strong>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-label">Top spillover</span>
            <strong className="stat-chip-value">{scenario.topAffected[0].name}</strong>
          </div>
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
                  weight: line.type === 'conflict' ? 2.8 : 2,
                  opacity: line.type === 'conflict' ? 0.7 : 0.55,
                  color:
                    line.type === 'conflict'
                      ? theme === 'light'
                        ? '#ad6735'
                        : '#ffb874'
                      : theme === 'light'
                        ? '#4f7fa4'
                        : '#7baccd',
                  dashArray: line.type === 'conflict' ? '7 8' : '4 9',
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

            {scenario.chokepoints.map((chokepoint) => {
              if (!chokepoint.coordinates) {
                return null
              }

              const isHighlighted = highlightedChokepoints.has(chokepoint.id)
              const isSelected = chokepoint.id === selectedChokepointId
              const color = isHighlighted
                ? theme === 'light'
                  ? '#b65934'
                  : '#f18c53'
                : theme === 'light'
                  ? '#70889e'
                  : '#8aa4ba'

              return (
                <CircleMarker
                  key={chokepoint.id}
                  center={[chokepoint.coordinates.lat, chokepoint.coordinates.lng]}
                  radius={isSelected ? 7 : 5.2}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.92,
                    weight: isSelected ? 2.3 : 1.2,
                  }}
                  eventHandlers={{
                    click: () => onSelectChokepoint(chokepoint.id),
                  }}
                >
                  <Tooltip
                    permanent={isHighlighted || isSelected}
                    direction="right"
                    offset={[6, 0]}
                    className="world-map-tooltip"
                  >
                    {chokepoint.name}
                  </Tooltip>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>

        <article className="mini-panel mt-4">
          <p className="eyebrow">
            {selectedChokepoint ? 'Selected chokepoint effect' : 'How to use'}
          </p>
          {selectedChokepoint ? (
            <>
              <h3 className="mt-2 text-2xl text-stone-100">
                {selectedChokepoint.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {selectedChokepoint.note}
              </p>
              <div className="mt-3 space-y-2">
                {selectedChokepointImpact.map((country) => (
                  <div
                    key={country.id}
                    className="flex items-center justify-between rounded-[8px] border px-3 py-2"
                  >
                    <span className="text-sm text-stone-100">{country.name}</span>
                    <span className="mono text-xs text-slate-400">
                      exposure {country.chokepointExposure} | score {country.totalScore}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Click any red chokepoint marker on the map to see which countries
              could be affected through this corridor.
            </p>
          )}
        </article>
      </div>
    </section>
  )
}

export default RippleBoard
