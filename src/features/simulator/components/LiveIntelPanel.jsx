function formatTrend(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'n/a'
  }

  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(1)}%`
}

function formatTimestamp(value) {
  if (!value) {
    return 'no timestamp'
  }

  try {
    const date = new Date(value)
    return date.toLocaleString()
  } catch {
    return value
  }
}

function LiveIntelPanel({
  presets,
  activePresetId,
  onApplyPreset,
  liveSignals,
  liveStatus,
  liveError,
  liveOverlayEnabled,
  onLiveOverlayToggle,
  onRefreshSignals,
  onApplySuggestions,
}) {
  const metrics = liveSignals?.metrics
  const traces = liveSignals?.traces
  const sourceHealthLabel =
    liveSignals?.sourceHealth === 'live'
      ? 'live'
      : liveSignals?.sourceHealth === 'partial'
        ? 'partial'
        : 'fallback'

  const metricCards = [
    {
      id: 'conflictHeat',
      label: 'Conflict heat',
      value: metrics?.conflictHeat,
      trend: traces?.conflict?.trendPct,
    },
    {
      id: 'oilStress',
      label: 'Oil stress',
      value: metrics?.oilStress,
      trend: traces?.oilNarrative?.trendPct,
    },
    {
      id: 'shippingStress',
      label: 'Shipping stress',
      value: metrics?.shippingStress,
      trend: traces?.shipping?.trendPct,
    },
    {
      id: 'indiaExposure',
      label: 'India exposure',
      value: metrics?.indiaExposure,
      trend: traces?.india?.trendPct,
    },
  ]

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Live intelligence overlay</p>
          <h2 className="panel-title">Conflict telemetry</h2>
        </div>
        <p className="panel-copy">
          Pulls open-source signals from real-world APIs and blends them into the
          structural model as capped multipliers.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <span className="field-label">Scenario presets</span>
          <div className="mt-3 grid gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`preset-pill ${
                  preset.id === activePresetId ? 'preset-pill-active' : ''
                }`}
                onClick={() => onApplyPreset(preset.id)}
              >
                <span>
                  <span className="block text-left text-sm font-semibold text-stone-100">
                    {preset.label}
                  </span>
                  <span className="mt-1 block text-left text-xs leading-5 text-slate-400">
                    {preset.summary}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="live-actions-row">
          <button
            type="button"
            className="live-action-button"
            onClick={onRefreshSignals}
            disabled={liveStatus === 'loading'}
          >
            {liveStatus === 'loading' ? 'Refreshing...' : 'Refresh live signals'}
          </button>
          <button
            type="button"
            className="live-action-button"
            onClick={onApplySuggestions}
            disabled={!liveSignals?.suggestedAdjustments}
          >
            Apply live adjustments
          </button>
        </div>

        <label className="overlay-toggle">
          <input
            type="checkbox"
            checked={liveOverlayEnabled}
            onChange={(event) => onLiveOverlayToggle(event.target.checked)}
          />
          <span>Live overlay enabled in model scoring</span>
        </label>

        {liveError ? <p className="live-error">{liveError}</p> : null}

        <div className="live-source-bar">
          <span className="mono text-xs uppercase tracking-[0.22em] text-slate-400">
            source health
          </span>
          <strong className="text-sm text-stone-100">{sourceHealthLabel}</strong>
          <span className="mono text-xs uppercase tracking-[0.22em] text-slate-400">
            updated
          </span>
          <strong className="text-sm text-stone-100">
            {formatTimestamp(liveSignals?.fetchedAt)}
          </strong>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {metricCards.map((metric) => (
            <article key={metric.id} className="live-metric-card">
              <p className="eyebrow">{metric.label}</p>
              <strong className="mt-2 block text-3xl text-stone-100">
                {metric.value ?? '--'}
              </strong>
              <p className="mt-2 text-xs text-slate-400">
                trend {formatTrend(metric.trend)}
              </p>
            </article>
          ))}
        </div>

        {liveSignals?.brentSignal ? (
          <article className="live-oil-strip">
            <p className="eyebrow">Brent spot reference / EIA</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <strong className="text-2xl text-stone-100">
                ${liveSignals.brentSignal.latestUsd.toFixed(2)} / bbl
              </strong>
              <span className="mono text-xs uppercase tracking-[0.22em] text-slate-400">
                daily change {formatTrend(liveSignals.brentSignal.changePct)} | as of{' '}
                {liveSignals.brentSignal.asOf}
              </span>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  )
}

export default LiveIntelPanel
