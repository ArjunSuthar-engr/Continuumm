function ImpactSidebar({ topCountries }) {
  return (
    <aside className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">External exposure</p>
          <h2 className="panel-title">Top affected countries</h2>
        </div>
        <p className="panel-copy">
          Ranked by aggregate stress after removing the two belligerents from the
          result set.
        </p>
      </div>

      <div className="space-y-3">
        {topCountries.map((country, index) => (
          <article key={country.id} className="impact-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="rank-badge">0{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-stone-100">
                      {country.name}
                    </h3>
                    <p className="text-sm text-slate-400">{country.region}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  {country.narrative}
                </p>
              </div>
              <div className="text-right">
                <p className="mono text-xs uppercase tracking-[0.3em] text-slate-400">
                  Score
                </p>
                <strong className="text-3xl text-amber-100">
                  {country.totalScore}
                </strong>
                <p className="mt-1 text-xs text-slate-400">{country.band}</p>
              </div>
            </div>

            <div className="mt-4 h-2 rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#d2b48c,#ff9d5c)]"
                style={{ width: `${country.totalScore}%` }}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {country.drivers.map((driver) => (
                <span key={driver.id} className="driver-pill">
                  {driver.label}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </aside>
  )
}

export default ImpactSidebar
