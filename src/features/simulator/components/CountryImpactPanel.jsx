const effectOptionLabels = {
  highest: 'Highest impact now',
  oil: 'Oil import costs may rise',
  petrol: 'Petrol and diesel prices may rise',
  freight: 'Freight and shipping costs may rise',
  inflation: 'Inflation may rise',
  electricity: 'Electricity tariffs may rise',
  industry: 'Industry and logistics stress may rise',
}

function getEffectOptionLabel(optionId, fallbackLabel) {
  return effectOptionLabels[optionId] ?? fallbackLabel
}

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
  const effectOptions = impactLensOptions.map((option) => {
    const lens = impactLenses[option.id]

    return {
      id: option.id,
      label: getEffectOptionLabel(option.id, option.label),
      score: lens?.score ?? null,
      reasonCount: lens?.reasonCount ?? 0,
    }
  })
  const activeReasons = activeLens?.reasons ?? []
  const hasActiveReasons = activeReasons.length > 0
  const selectedReason =
    activeReasons.find((reason) => reason.chokepointId === activeEffectPoint?.id) ??
    activeReasons[0] ??
    null
  const compactEffects = [
    ...(countryEffects?.primaryEffects ?? []),
    ...(countryEffects?.secondaryEffects ?? []),
  ].sort((a, b) => b.score - a.score)

  function handleEffectOptionSelect(nextLensId) {
    onImpactLensSelect(nextLensId)
    const topReason = impactLenses[nextLensId]?.topReason

    if (topReason?.chokepointId) {
      onEffectPointSelect(topReason.chokepointId)
    }
  }

  return (
    <aside className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Country effect</p>
          <h2 className="panel-title">Impact on one country</h2>
        </div>
        <p className="panel-copy">
          {hasActiveReasons
            ? 'Pick one effect and immediately see the chokepoints that drive it.'
            : `No active chokepoint pathway is detected for ${selectedCountry?.name ?? 'this country'} in the current setup.`}
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
          </div>

          <p className="eyebrow mt-4">Effect options</p>
          <p className="impact-options-copy mt-2">
            Choose one outcome channel. Then click any reason below to inspect why it
            may rise.
          </p>

          <div className="impact-effect-option-grid mt-3">
            {effectOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`impact-effect-option ${
                  activeLensId === option.id ? 'impact-effect-option-active' : ''
                }`}
                onClick={() => handleEffectOptionSelect(option.id)}
              >
                <span className="impact-effect-option-copy">
                  <strong>{option.label}</strong>
                  <span>
                    {option.reasonCount > 0
                      ? `${option.reasonCount} route reasons`
                      : hasEffectPoints
                        ? 'No direct route reason for this effect yet'
                        : 'No controllable route in this war setup'}
                  </span>
                </span>
                <span className="impact-effect-option-score">
                  {option.score ?? '--'}
                  <small>/100</small>
                </span>
              </button>
            ))}
          </div>
        </article>

        <article className="impact-card">
          <div className="impact-lens-head">
            <div>
              <p className="eyebrow">Selected effect</p>
              <h3 className="impact-lens-title">
                {getEffectOptionLabel(activeLensId, activeLens?.label ?? 'Highest impact')}
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

          <p className="eyebrow mt-4">Why this may rise</p>
          {hasEffectPoints && activeReasons.length > 0 ? (
            <div className="impact-reason-list mt-3">
              {activeReasons.map((reason) => {
                const isReasonActive = reason.chokepointId === selectedReason?.chokepointId

                return (
                  <button
                    key={reason.id}
                    type="button"
                    className={`impact-reason-button ${
                      isReasonActive ? 'impact-reason-button-active' : ''
                    }`}
                    onClick={() => onEffectPointSelect(reason.chokepointId)}
                  >
                    <div className="impact-reason-head">
                      <strong className="impact-reason-title">{reason.chokepointName}</strong>
                      <span className="impact-reason-share">
                        {reason.contributionPct}% of pressure
                      </span>
                    </div>
                    <p className="impact-reason-line">{reason.summary}</p>
                    <p className="impact-reason-line">{reason.evidenceLine}</p>
                    <p className="impact-reason-meta">
                      Control {reason.controlEffectiveScorePct}/100 vs threshold{' '}
                      {reason.controlThresholdPct}/100 | {reason.controlBy} |{' '}
                      {reason.pressureBand} pressure
                    </p>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="impact-driver-line mt-3">
              No ranked chokepoint reason is active for this effect right now. Try a
              different war pair or raise severity to cross route-control thresholds.
            </p>
          )}

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
          <p className="eyebrow">Selected effect point</p>
          {hasEffectPoints ? (
            <>
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
              No chokepoint is currently controllable by this war pair at the chosen
              posture. Change pair, mode, or intensity to surface direct route
              pressure.
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
