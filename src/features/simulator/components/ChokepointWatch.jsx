import { chokepoints } from '../data/network.js'

function ChokepointWatch({ blockedChokepointIds }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Critical terrain</p>
          <h2 className="panel-title">Chokepoint watch</h2>
        </div>
        <p className="panel-copy">
          These gateways translate regional fighting into system-wide logistics
          stress.
        </p>
      </div>

      <div className="space-y-3">
        {chokepoints.map((chokepoint) => {
          const active = blockedChokepointIds.includes(chokepoint.id)

          return (
            <article
              key={chokepoint.id}
              className={`chokepoint-card ${
                active ? 'chokepoint-card-active' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-100">
                    {chokepoint.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {chokepoint.note}
                  </p>
                </div>
                <div className="text-right">
                  <p className="mono text-xs uppercase tracking-[0.25em] text-slate-400">
                    status
                  </p>
                  <strong className="text-lg text-amber-100">
                    {active ? 'Blocked' : 'Open'}
                  </strong>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                <span>{chokepoint.region}</span>
                <span className="mono">base pressure {chokepoint.pressure}</span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ChokepointWatch
