import {
  ChannelPressureGrid,
  ChokepointWatch,
  ConflictPanel,
  ImpactSidebar,
  LiveIntelPanel,
  RippleBoard,
  useConflictScenario,
} from '../features/simulator'

function SimulatorPage() {
  const {
    aggressorId,
    defenderId,
    focusModeId,
    intensity,
    blockedChokepointIds,
    scenario,
    presets,
    activePresetId,
    liveSignals,
    liveStatus,
    liveError,
    liveOverlayEnabled,
    handleCountryChange,
    setIntensity,
    setFocusModeId,
    toggleChokepoint,
    setLiveOverlayEnabled,
    refreshLiveSignals,
    applyPreset,
    applyLiveSuggestions,
  } = useConflictScenario()
  const activePreset =
    presets.find((preset) => preset.id === activePresetId) ?? presets[0]
  const liveContextActorIds = activePreset?.contextActorIds ?? [
    'united-states',
    'india',
  ]

  return (
    <div className="space-y-6">
      <section className="hero-shell hero-command px-5 py-9 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow">Simulator / command theater</p>
            <h1 className="hero-title mt-4 text-5xl leading-none text-stone-100 sm:text-6xl">
              Model war as a system shock, not an isolated front.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Set the conflict pair, adjust the severity, shut key maritime gates,
              and inspect which outside countries absorb the largest secondary
              pressure.
            </p>
          </div>

          <div className="dispatch-column">
            <article className="dispatch-card">
              <p className="eyebrow">Conflict pair</p>
              <h2 className="mt-3 text-3xl leading-none text-stone-100">
                {scenario.aggressor.name} vs {scenario.defender.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Focus mode: {scenario.focusMode.label}. Blocked gateways:{' '}
                {scenario.blockedChokepoints.length}.
              </p>
            </article>
            <article className="dispatch-card">
              <p className="eyebrow">System signal</p>
              <div className="mt-4 grid gap-3">
                <div className="signal-row">
                  <span className="signal-row-label">Stress posture</span>
                  <strong className="signal-row-value">
                    {scenario.summary.systemicStress}
                  </strong>
                </div>
                <div className="signal-row">
                  <span className="signal-row-label">Fuel shock</span>
                  <strong className="signal-row-value">
                    {scenario.summary.fuelPressure}/100
                  </strong>
                </div>
                <div className="signal-row">
                  <span className="signal-row-label">Detour load</span>
                  <strong className="signal-row-value">
                    {scenario.summary.detourMiles.toLocaleString()} nm
                  </strong>
                </div>
                <div className="signal-row">
                  <span className="signal-row-label">Live overlay</span>
                  <strong className="signal-row-value">
                    {liveOverlayEnabled
                      ? scenario.summary.liveOverlay?.sourceHealth ?? 'syncing'
                      : 'disabled'}
                  </strong>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <LiveIntelPanel
            presets={presets}
            activePresetId={activePresetId}
            onApplyPreset={applyPreset}
            liveSignals={liveSignals}
            liveStatus={liveStatus}
            liveError={liveError}
            liveOverlayEnabled={liveOverlayEnabled}
            onLiveOverlayToggle={setLiveOverlayEnabled}
            onRefreshSignals={() =>
              refreshLiveSignals({
                contextActorIds: liveContextActorIds,
              })
            }
            onApplySuggestions={applyLiveSuggestions}
          />
          <ConflictPanel
            aggressorId={aggressorId}
            defenderId={defenderId}
            focusModeId={focusModeId}
            intensity={intensity}
            blockedChokepointIds={blockedChokepointIds}
            onCountryChange={handleCountryChange}
            onIntensityChange={setIntensity}
            onFocusModeChange={setFocusModeId}
            onToggleChokepoint={toggleChokepoint}
          />
        </div>
        <RippleBoard
          scenario={scenario}
          blockedChokepointIds={blockedChokepointIds}
        />
        <ImpactSidebar topCountries={scenario.topAffected} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChannelPressureGrid channelPressure={scenario.channelPressure} />
        <ChokepointWatch blockedChokepointIds={blockedChokepointIds} />
      </section>
    </div>
  )
}

export default SimulatorPage
