import { chokepoints } from '../data/network.js'

function CountryImpactPanel({
  scenario,
  selectedCountryId,
  onCountrySelect,
}) {
  const selectedCountry = scenario.countries.find(
    (country) => country.id === selectedCountryId,
  )
  const selectedImpact = scenario.results.find(
    (country) => country.id === selectedCountryId,
  )
  const topChokepoints = chokepoints
    .map((chokepoint) => ({
      ...chokepoint,
      exposure:
        (chokepoint.exposures[selectedCountryId] ?? 0) +
        (selectedCountry?.chokepointExposure[chokepoint.id] ?? 0),
    }))
    .filter((chokepoint) => chokepoint.exposure > 0)
    .sort((a, b) => b.exposure - a.exposure)
    .slice(0, 3)

  return (
    <aside className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Country effect</p>
          <h2 className="panel-title">Impact on one country</h2>
        </div>
        <p className="panel-copy">
          Select any country to inspect score, drivers, and chokepoint sensitivity.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="field-label" htmlFor="analysis-country">
            Country
          </label>
          <select
            id="analysis-country"
            className="field-control"
            value={selectedCountryId}
            onChange={(event) => onCountrySelect(event.target.value)}
          >
            {scenario.countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <article className="impact-card">
          <p className="eyebrow">Score</p>
          <h3 className="mt-2 text-4xl text-stone-100">
            {selectedImpact ? selectedImpact.totalScore : '--'}
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            {selectedImpact
              ? `${selectedImpact.band} pressure`
              : 'Belligerent core country (not ranked in external spillover list).'}
          </p>
        </article>

        <article className="impact-card">
          <p className="eyebrow">Why this country moves</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {selectedImpact?.narrative ?? selectedCountry?.signature}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(selectedImpact?.drivers ?? []).map((driver) => (
              <span key={driver.id} className="driver-pill">
                {driver.label}
              </span>
            ))}
          </div>
        </article>

        <article className="impact-card">
          <p className="eyebrow">Most relevant chokepoints</p>
          <div className="mt-3 space-y-2">
            {topChokepoints.length ? (
              topChokepoints.map((chokepoint) => (
                <div
                  key={chokepoint.id}
                  className="flex items-center justify-between gap-3 rounded-[8px] border px-3 py-2"
                >
                  <span className="text-sm text-stone-100">{chokepoint.name}</span>
                  <span className="mono text-xs text-slate-400">
                    exposure {chokepoint.exposure}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-300">
                No strong chokepoint dependence in the current seed model.
              </p>
            )}
          </div>
        </article>
      </div>
    </aside>
  )
}

export default CountryImpactPanel
