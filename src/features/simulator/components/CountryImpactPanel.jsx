function CountryImpactPanel({
  scenario,
  effectPoints,
  selectedCountryId,
  selectedEffectPointId,
  onEffectPointSelect,
  onCountrySelect,
}) {
  const selectedCountry = scenario.countries.find(
    (country) => country.id === selectedCountryId,
  )
  const selectedImpact = scenario.results.find(
    (country) => country.id === selectedCountryId,
  )
  const selectedEffectPoint = effectPoints.find(
    (point) => point.id === selectedEffectPointId,
  )
  const activeEffectPoint = selectedEffectPoint ?? effectPoints[0]
  const hasEffectPoints = effectPoints.length > 0
  const immediateOutcome = selectedImpact
    ? `${selectedCountry?.name} is currently under ${selectedImpact.band.toLowerCase()} structural pressure (${selectedImpact.totalScore}/100).`
    : `${selectedCountry?.name} is one of the belligerents, so downstream ranking appears on third-country economies.`
  const outcomeLine = hasEffectPoints
    ? immediateOutcome
    : `No chokepoint is currently disruptable by ${scenario.aggressor.name} or ${scenario.defender.name}, so direct route shock on ${selectedCountry?.name} is limited in this scenario.`

  return (
    <aside className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Country effect</p>
          <h2 className="panel-title">Impact on one country</h2>
        </div>
        <p className="panel-copy">
          Select a country, then inspect map-linked effect points to understand how
          conflict pressure can propagate into prices and logistics.
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
          <p className="eyebrow">Immediate outcome</p>
          <p className="impact-headline">{outcomeLine}</p>
          <p className="mt-2 text-sm text-slate-300">
            War pair: {scenario.aggressor.name} vs {scenario.defender.name}
          </p>
        </article>

        <article className="impact-card">
          <p className="eyebrow">Potential effect points</p>
          {hasEffectPoints ? (
            <div className="mt-3 space-y-2">
              {effectPoints.map((point) => (
                <button
                  key={point.id}
                  type="button"
                  className={`effect-point-row ${
                    point.id === selectedEffectPointId
                      ? 'effect-point-row-active'
                      : ''
                  }`}
                  onClick={() => onEffectPointSelect(point.id)}
                >
                  <span className="effect-point-row-copy">
                    <strong>{point.name}</strong>
                    <span>
                      dependence {point.modelledImportShare}% | score {point.score}
                    </span>
                  </span>
                  <span className="effect-point-row-band">{point.band}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Choose another war pair or increase severity to see routes where one
              belligerent can realistically pressure transit.
            </p>
          )}
        </article>

        <article className="impact-card">
          <p className="eyebrow">Selected point insight</p>
          <h3 className="mt-2 text-xl text-stone-100">
            {activeEffectPoint?.name ?? 'No effect point selected'}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {activeEffectPoint
              ? activeEffectPoint.whyLine
              : selectedImpact?.narrative ?? selectedCountry?.signature}
          </p>
          {activeEffectPoint ? (
            <>
              <p className="mt-2 text-xs text-slate-400">
                Control: {activeEffectPoint.controlNarrative}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Data basis: {activeEffectPoint.dataBasis} | source:{' '}
                {activeEffectPoint.dataSource}
              </p>
            </>
          ) : null}
          <div className="effect-outcome-list">
            {(activeEffectPoint?.outcomes ?? []).map((outcome) => (
              <div key={outcome.id} className="effect-outcome-item">
                <span>{outcome.label}</span>
                <strong>
                  {outcome.effect} | {outcome.score}/100
                </strong>
              </div>
            ))}
          </div>
        </article>
      </div>
    </aside>
  )
}

export default CountryImpactPanel
