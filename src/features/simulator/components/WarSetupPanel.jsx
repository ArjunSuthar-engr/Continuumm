import { countries } from '../data/network.js'

function WarSetupPanel({
  aggressorId,
  defenderId,
  intensity,
  blockedChokepointIds,
  onCountryChange,
  onIntensityChange,
}) {
  return (
    <aside className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">War setup</p>
          <h2 className="panel-title">Conflict pair</h2>
        </div>
        <p className="panel-copy">
          Select the two countries. The map automatically highlights the most
          vulnerable chokepoints in red for this war pair.
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
            Red markers in the map represent the chokepoints currently under the
            highest modeled stress for this conflict.
          </p>
        </article>
      </div>
    </aside>
  )
}

export default WarSetupPanel
