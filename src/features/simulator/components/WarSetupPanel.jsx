import { countries } from '../data/network.js'

function WarSetupPanel({
  aggressorId,
  defenderId,
  conflictModeId,
  durationId,
  intensity,
  blockedChokepointIds,
  controlMap,
  conflictModes,
  conflictDurations,
  onCountryChange,
  onConflictModeChange,
  onDurationChange,
  onIntensityChange,
}) {
  const controlRows = Object.values(controlMap ?? {})
    .sort(
      (a, b) =>
        Number(b.canDisrupt) - Number(a.canDisrupt) ||
        b.effectiveScore - a.effectiveScore,
    )
    .slice(0, 5)

  return (
    <aside className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">War setup</p>
          <h2 className="panel-title">Conflict pair</h2>
        </div>
        <p className="panel-copy">
          Select the two countries. The map highlights only chokepoints where at
          least one belligerent can plausibly disrupt transit.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="field-label" htmlFor="war-country-a">
            Country A
          </label>
          <select
            id="war-country-a"
            className="field-control"
            value={aggressorId}
            onChange={(event) => onCountryChange('aggressor', event.target.value)}
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="war-country-b">
            Country B
          </label>
          <select
            id="war-country-b"
            className="field-control"
            value={defenderId}
            onChange={(event) => onCountryChange('defender', event.target.value)}
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="conflict-mode">
            Conflict mode
          </label>
          <select
            id="conflict-mode"
            className="field-control"
            value={conflictModeId}
            onChange={(event) => onConflictModeChange(event.target.value)}
          >
            {conflictModes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="conflict-duration">
            Duration
          </label>
          <select
            id="conflict-duration"
            className="field-control"
            value={durationId}
            onChange={(event) => onDurationChange(event.target.value)}
          >
            {conflictDurations.map((duration) => (
              <option key={duration.id} value={duration.id}>
                {duration.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="field-label" htmlFor="war-intensity">
              Severity
            </label>
            <span className="mono text-sm text-amber-100/80">{intensity}%</span>
          </div>
          <input
            id="war-intensity"
            type="range"
            min="25"
            max="95"
            value={intensity}
            onChange={(event) => onIntensityChange(Number(event.target.value))}
            className="mt-3 w-full accent-amber-400"
          />
        </div>

        <article className="mini-panel">
          <p className="eyebrow">Auto-highlighted chokepoints</p>
          <h3 className="mt-2 text-2xl text-stone-100">
            {blockedChokepointIds.length}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {blockedChokepointIds.length > 0
              ? 'Red markers represent chokepoints under stress that the selected war pair can actually pressure.'
              : 'No chokepoint meets the control threshold for this war pair at the current severity.'}
          </p>
        </article>

        <article className="mini-panel">
          <p className="eyebrow">Control explainers</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Route impact is shown only when effective leverage crosses threshold.
          </p>
          <div className="control-explainer-list mt-3">
            {controlRows.map((row) => {
              const effectiveScore = Math.round(row.effectiveScore * 100)
              const threshold = Math.round(row.threshold * 100)

              return (
                <article
                  key={row.chokepointId}
                  className={`control-explainer-row ${
                    row.canDisrupt ? 'control-explainer-row-active' : ''
                  }`}
                >
                  <div className="control-explainer-copy">
                    <strong>{row.chokepointName}</strong>
                    <span>
                      Controller: {row.controllerName} ({row.mode}) |{' '}
                      {effectiveScore}/100 vs threshold {threshold}/100
                    </span>
                  </div>
                  <span className="control-explainer-status">
                    {row.canDisrupt ? 'Eligible' : 'Limited'}
                  </span>
                </article>
              )
            })}
          </div>
        </article>
      </div>
    </aside>
  )
}

export default WarSetupPanel
