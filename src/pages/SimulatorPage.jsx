import {
  ChannelPressureGrid,
  ChokepointWatch,
  ConflictPanel,
  ImpactSidebar,
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
    handleCountryChange,
    setIntensity,
    setFocusModeId,
    toggleChokepoint,
  } = useConflictScenario()

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(7,17,26,0.94),rgba(11,32,46,0.8)_55%,rgba(164,112,68,0.16))] px-5 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="eyebrow">Simulator / live prototype</p>
            <h1 className="mt-4 text-5xl leading-none text-stone-100 sm:text-6xl">
              Model war as a system shock, not an isolated front.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Set the conflict pair, adjust the severity, shut key maritime gates,
              and inspect which outside countries absorb the largest secondary
              pressure.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <article className="metric-card">
              <span className="metric-label">Systemic stress</span>
              <strong className="metric-value">
                {scenario.summary.systemicStress}
              </strong>
              <p className="metric-copy">
                Average exposure of the five most affected external states.
              </p>
            </article>
            <article className="metric-card">
              <span className="metric-label">Fuel pressure</span>
              <strong className="metric-value">
                {scenario.summary.fuelPressure}/100
              </strong>
              <p className="metric-copy">
                Harder substitution and pricier maritime insurance.
              </p>
            </article>
            <article className="metric-card">
              <span className="metric-label">Detour load</span>
              <strong className="metric-value">
                {scenario.summary.detourMiles.toLocaleString()} nm
              </strong>
              <p className="metric-copy">
                Additional route distance driven by closures and rerouting.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)_330px]">
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
        <RippleBoard
          scenario={scenario}
          blockedChokepointIds={blockedChokepointIds}
        />
        <ImpactSidebar topCountries={scenario.topAffected} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ChannelPressureGrid channelPressure={scenario.channelPressure} />
        <ChokepointWatch blockedChokepointIds={blockedChokepointIds} />
      </section>
    </div>
  )
}

export default SimulatorPage
