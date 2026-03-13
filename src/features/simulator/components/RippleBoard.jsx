import { chokepoints, countries } from '../data/network.js'

function RippleBoard({ scenario, blockedChokepointIds }) {
  const topCountries = scenario.topAffected
  const networkNodes = [...countries, ...chokepoints]
  const theaterLines = topCountries.flatMap((country) => [
    {
      id: `${scenario.aggressor.id}-${country.id}`,
      from: scenario.aggressor.position,
      to: country.position,
      type: 'conflict',
    },
    {
      id: `${scenario.defender.id}-${country.id}`,
      from: scenario.defender.position,
      to: country.position,
      type: 'spillover',
    },
  ])

  return (
    <section className="panel overflow-hidden">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Theater board</p>
          <h2 className="panel-title">Ripple map</h2>
        </div>
        <p className="panel-copy">
          The model highlights the most exposed external countries and the
          sea-lane pressures transmitting the shock.
        </p>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(5,15,23,0.88),rgba(9,25,37,0.78))] p-4 sm:p-5">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">
              Live scenario / {scenario.aggressor.name} vs. {scenario.defender.name}
            </p>
            <h3 className="mt-3 text-3xl text-stone-100 sm:text-4xl">
              {scenario.focusMode.label} lens with{' '}
              {scenario.blockedChokepoints.length} constrained maritime gateways.
            </h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="stat-chip">
              <span className="stat-chip-label">Avg impact</span>
              <strong className="stat-chip-value">
                {scenario.summary.averageScore}
              </strong>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-label">Top spillover</span>
              <strong className="stat-chip-value">{topCountries[0].name}</strong>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-label">Primary driver</span>
              <strong className="stat-chip-value">
                {topCountries[0].drivers[0].label}
              </strong>
            </div>
          </div>
        </div>

        <div className="theater-stage mt-5">
          <div className="theater-fog" />
          <svg
            viewBox="0 0 100 65"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {theaterLines.map((line) => (
              <line
                key={line.id}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                className={
                  line.type === 'conflict'
                    ? 'theater-line theater-line-conflict'
                    : 'theater-line theater-line-spillover'
                }
              />
            ))}
          </svg>

          {networkNodes.map((node) => {
            const isCountry = 'code' in node
            const isSelected =
              isCountry &&
              (node.id === scenario.aggressor.id || node.id === scenario.defender.id)
            const isTopCountry =
              isCountry &&
              topCountries.some((country) => country.id === node.id)
            const isBlocked = !isCountry && blockedChokepointIds.includes(node.id)

            return (
              <div
                key={node.id}
                className={`node-marker ${
                  isSelected
                    ? 'node-marker-selected'
                    : isBlocked
                      ? 'node-marker-blocked'
                      : isTopCountry
                        ? 'node-marker-exposed'
                        : ''
                }`}
                style={{
                  left: `${node.position.x}%`,
                  top: `${(node.position.y / 65) * 100}%`,
                }}
              >
                <span className="node-dot" />
                <div className="node-label">
                  <span className="mono node-code">{isCountry ? node.code : 'CP'}</span>
                  <span className="node-name">{node.name}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <article className="mini-panel">
            <p className="eyebrow">Conflict core</p>
            <h4 className="mt-2 text-2xl text-stone-100">
              {scenario.aggressor.name} vs. {scenario.defender.name}
            </h4>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This pair drives the baseline disruption. Every third-country score
              measures indirect pressure beyond the front line.
            </p>
          </article>
          <article className="mini-panel">
            <p className="eyebrow">Model stance</p>
            <h4 className="mt-2 text-2xl text-stone-100">
              Structural, not predictive
            </h4>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Continuumm visualizes vulnerability in the network rather than
              claiming certainty about policy choices or battle outcomes.
            </p>
          </article>
          <article className="mini-panel">
            <p className="eyebrow">Seed network</p>
            <h4 className="mt-2 text-2xl text-stone-100">
              {countries.length} strategic states
            </h4>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The prototype starts with a curated set of economies, exporters, and
              chokepoints before scaling toward broader world coverage.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default RippleBoard
