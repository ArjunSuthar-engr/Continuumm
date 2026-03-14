function CountryImpactPanel({
  scenario,
  effectPoints,
  countryEffects,
  selectedCountryId,
  selectedEffectPointId,
  selectedImpactLensId,
  onEffectPointSelect,
  onCountrySelect,
  onImpactLensSelect,
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
  const activeEffectPoint = selectedEffectPoint ?? effectPoints[0] ?? null
  const hasEffectPoints = effectPoints.length > 0
  const horizonCards = countryEffects?.horizonCards ?? []
  const oneLineSummary = countryEffects?.oneLineSummary
  const immediateOutcome = selectedImpact
    ? `${selectedCountry?.name} is currently under ${selectedImpact.band.toLowerCase()} structural pressure (${selectedImpact.totalScore}/100).`
    : `${selectedCountry?.name} is one of the belligerents, so downstream ranking appears on third-country economies.`
  const outcomeLine = hasEffectPoints
    ? `${countryEffects?.immediateSummary ?? immediateOutcome}`
    : `No chokepoint is currently disruptable by ${scenario.aggressor.name} or ${scenario.defender.name}, so direct route shock on ${selectedCountry?.name} is limited in this scenario.`
  const headlineLine = hasEffectPoints ? oneLineSummary ?? outcomeLine : outcomeLine

  const impactLensOptions = countryEffects?.impactLensOptions ?? [
    { id: 'highest', label: 'Highest impact' },
  ]
  const impactLenses = countryEffects?.impactLenses ?? {}
  const fallbackLensId = impactLensOptions[0]?.id ?? 'highest'
  const activeLensId = impactLenses[selectedImpactLensId]
    ? selectedImpactLensId
    : fallbackLensId
  const activeLens = impactLenses[activeLensId]
  const compactEffects = [
    ...(countryEffects?.primaryEffects ?? []),
    ...(countryEffects?.secondaryEffects ?? []),
  ].sort((a, b) => b.score - a.score)

  return (
    <aside className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Country effect</p>
          <h2 className="panel-title">Impact on one country</h2>
        </div>
        <p className="panel-copy">
          Pick one lens at a time to read only the impact channel you care about.
        </p>
      </div>

      <div className="space-y-5">
        <article className="impact-card">
          <div className="impact-selector-grid">
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

            <div>
              <label className="field-label" htmlFor="impact-lens">
                Impact lens
              </label>
              <select
                id="impact-lens"
                className="field-control"
                value={activeLensId}
                onChange={(event) => onImpactLensSelect(event.target.value)}
              >
                {impactLensOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </article>

        <article className="impact-card">
          <div className="impact-lens-head">
            <div>
              <p className="eyebrow">Selected lens</p>
              <h3 className="impact-lens-title">
                {activeLens?.label ?? 'Highest impact'}
              </h3>
            </div>
            <div className="impact-lens-score">
              {activeLens?.score ?? 6}
              <span>/100</span>
            </div>
          </div>

          <p className="impact-headline">{activeLens?.verdict ?? headlineLine}</p>

          <div className="impact-driver-list mt-3">
            {(activeLens?.why ?? [outcomeLine]).map((line, index) => (
              <p key={`${activeLensId}-driver-${index}`} className="impact-driver-line">
                {line}
              </p>
            ))}
          </div>

          <div className="impact-meta-row mt-3">
            <span className="impact-meta-pill">
              {activeLens?.band ?? 'Low'} pressure
            </span>
            <span className="impact-meta-pill">
              {activeLens?.confidence ?? 'Low'} confidence
            </span>
            <span className="impact-meta-pill">
              Basis: {activeLens?.dataBasis ?? 'modelled'}
            </span>
            <span className="impact-meta-pill">
              Data snapshot: {countryEffects?.dataAsOf ?? 'n/a'}
            </span>
          </div>
          <p className="effect-impact-source mt-3">
            Source: {activeLens?.dataSource ?? 'Model fallback'}
          </p>
        </article>

        <article className="impact-card">
          <p className="eyebrow">Chokepoint focus</p>
          {hasEffectPoints ? (
            <>
              <label className="field-label mt-3 block" htmlFor="effect-point">
                Effect point
              </label>
              <select
                id="effect-point"
                className="field-control"
                value={activeEffectPoint?.id ?? ''}
                onChange={(event) => onEffectPointSelect(event.target.value)}
              >
                {effectPoints.map((point) => (
                  <option key={point.id} value={point.id}>
                    {point.name} ({point.band})
                  </option>
                ))}
              </select>

              <h3 className="mt-3 text-xl text-stone-100">{activeEffectPoint?.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {activeEffectPoint?.whyLine}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Control: {activeEffectPoint?.controlNarrative}
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Choose another war pair or increase severity to see routes where one
              belligerent can realistically pressure transit.
            </p>
          )}
        </article>

        <details className="impact-card impact-details-card">
          <summary className="impact-details-summary">Show details</summary>
          <div className="impact-details-content">
            <p className="eyebrow">Horizon read</p>
            <div className="horizon-grid mt-3">
              {horizonCards.map((card) => (
                <div key={card.id} className="horizon-card">
                  <div className="horizon-head">
                    <p className="horizon-label">{card.label}</p>
                    <p className="horizon-window">{card.window}</p>
                  </div>
                  <p className="horizon-score">
                    {card.score}/100 <span>{card.band}</span>
                  </p>
                  <p className="horizon-summary">{card.summary}</p>
                </div>
              ))}
            </div>

            <p className="eyebrow mt-4">All model channels</p>
            <div className="effect-impact-list mt-3">
              {compactEffects.map((effect) => (
                <div key={effect.id} className="effect-impact-item">
                  <div className="effect-impact-copy">
                    <strong>{effect.label}</strong>
                    <span>{effect.summary}</span>
                  </div>
                  <div className="effect-impact-meta">
                    <span className="effect-impact-score">
                      {effect.score}/100 | {effect.band}
                    </span>
                    <span className="effect-impact-tag">{effect.dataBasis}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </aside>
  )
}

export default CountryImpactPanel
