import { chokepoints, countries, focusModes } from '../data/network.js'

function ConflictPanel({
  aggressorId,
  defenderId,
  focusModeId,
  intensity,
  blockedChokepointIds,
  onCountryChange,
  onIntensityChange,
  onFocusModeChange,
  onToggleChokepoint,
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Scenario setup</p>
          <h2 className="panel-title">Conflict inputs</h2>
        </div>
        <p className="panel-copy">
          Pick the two states in conflict, adjust disruption intensity, then close
          the chokepoints that matter.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="field-label" htmlFor="aggressor">
            First belligerent
          </label>
          <select
            id="aggressor"
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
          <label className="field-label" htmlFor="defender">
            Second belligerent
          </label>
          <select
            id="defender"
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
          <div className="flex items-center justify-between">
            <label className="field-label" htmlFor="intensity">
              Disruption intensity
            </label>
            <span className="mono text-sm text-amber-100/80">{intensity}%</span>
          </div>
          <input
            id="intensity"
            type="range"
            min="25"
            max="95"
            value={intensity}
            onChange={(event) => onIntensityChange(Number(event.target.value))}
            className="mt-3 w-full accent-amber-400"
          />
          <p className="mt-2 text-sm text-slate-400">
            Higher intensity compounds sanctions, route closures, and emergency
            reallocation.
          </p>
        </div>

        <div>
          <span className="field-label">Analytical focus</span>
          <div className="mt-3 grid gap-2">
            {focusModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`focus-pill ${
                  mode.id === focusModeId ? 'focus-pill-active' : ''
                }`}
                onClick={() => onFocusModeChange(mode.id)}
              >
                <span className="text-left">
                  <span className="block text-sm font-semibold text-stone-100">
                    {mode.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-400">
                    {mode.summary}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="field-label">Closed chokepoints</span>
          <div className="mt-3 grid gap-2">
            {chokepoints.map((chokepoint) => {
              const active = blockedChokepointIds.includes(chokepoint.id)

              return (
                <button
                  key={chokepoint.id}
                  type="button"
                  className={`chokepoint-pill ${
                    active ? 'chokepoint-pill-active' : ''
                  }`}
                  onClick={() => onToggleChokepoint(chokepoint.id)}
                >
                  <span>
                    <span className="block text-left text-sm font-semibold text-stone-100">
                      {chokepoint.name}
                    </span>
                    <span className="mt-1 block text-left text-xs leading-5 text-slate-400">
                      {chokepoint.note}
                    </span>
                  </span>
                  <span className="mono text-xs text-amber-100/80">
                    {active ? 'blocked' : 'open'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConflictPanel
