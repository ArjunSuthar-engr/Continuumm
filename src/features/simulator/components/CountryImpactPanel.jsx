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
  selectedImpactLensId,
  onEffectPointSelect,
  onCountrySelect,
  onImpactLensSelect,
  onOpenReasonOverlay,
}) {
  const selectedCountry = scenario.countries.find(
    (country) => country.id === selectedCountryId,
  )
  const hasEffectPoints = effectPoints.length > 0
  const horizonCards = countryEffects?.horizonCards ?? []

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
  const compactEffects = [
    ...(countryEffects?.primaryEffects ?? []),
    ...(countryEffects?.secondaryEffects ?? []),
  ].sort((a, b) => b.score - a.score)

  function handleEffectOptionSelect(nextLensId) {
    onImpactLensSelect(nextLensId)
    onOpenReasonOverlay?.()
    const topReason = impactLenses[nextLensId]?.topReason

    if (topReason?.chokepointId) {
      onEffectPointSelect(topReason.chokepointId)
    }
  }

  return (
    <aside className="panel country-impact-panel">
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
        <article className="impact-card impact-card-fixed">
          <div className="impact-selector-grid">
            <div>
              <label className="field-label" htmlFor="analysis-country">
                Country
              </label>
              <div className="field-select-shell">
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
                <span className="field-select-spark" aria-hidden="true" />
              </div>
            </div>
          </div>

          <p className="eyebrow mt-4">Effect options</p>
          <p className="impact-options-copy mt-2">
            Choose one outcome channel. The selected effect and reasons open over
            the map.
          </p>

          <div className="impact-effect-option-scroller mt-3">
            <div className="impact-effect-option-grid">
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
          </div>
        </article>

        <details className="impact-card impact-details-card">
          <summary className="impact-details-summary">Show details</summary>
          <div className="impact-details-content impact-details-content-scroll">
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
