import {
  calibrationEpisodes,
  calibrationSnapshot,
  chokepoints,
  countries,
  focusModes,
  simulatorAssumptions,
  simulatorLimitations,
} from '../features/simulator'
import {
  channelDescriptions,
  methodologyPrinciples,
  methodologySteps,
  limitations as prototypeLimitations,
} from '../data/projectContent'

function MethodologyPage() {
  return (
    <div className="space-y-6">
      <section className="hero-shell hero-dossier px-5 py-8 sm:px-6 lg:px-8">
        <p className="eyebrow">Methodology</p>
        <h1 className="mt-4 max-w-4xl text-5xl leading-none text-stone-100 sm:text-6xl">
          Explain the mechanism, the inputs, and the limits before the user trusts
          the score.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          This page exists so Continuumm stays honest. The simulator should show
          what structural spillover means, what the present model measures, and
          what it still leaves out.
        </p>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Pipeline</p>
            <h2 className="panel-title">How the prototype currently works</h2>
          </div>
          <p className="panel-copy">
            The present model is intentionally legible. Every result starts from a
            small set of user controls and travels through four explicit steps.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {methodologySteps.map((step) => (
            <article key={step.id} className="story-card">
              <p className="eyebrow">{step.id}</p>
              <h3 className="mt-3 text-2xl text-stone-100">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Channels</p>
              <h2 className="panel-title">The four pressure lanes</h2>
            </div>
            <p className="panel-copy">
              Every country score is built from these four lanes before focus-mode
              weighting is applied.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(channelDescriptions).map(([channel, description]) => (
              <article key={channel} className="channel-card">
                <p className="eyebrow">{channel}</p>
                <h3 className="mt-3 text-2xl text-stone-100">
                  {channel[0].toUpperCase() + channel.slice(1)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Lenses</p>
              <h2 className="panel-title">Focus modes change weighting, not truth</h2>
            </div>
            <p className="panel-copy">
              The analytical lens changes emphasis. It helps the user ask different
              questions from the same structural network.
            </p>
          </div>

          <div className="grid gap-3">
            {focusModes.map((mode) => (
              <article key={mode.id} className="story-card">
                <p className="eyebrow">{mode.label}</p>
                <h3 className="mt-3 text-2xl text-stone-100">{mode.summary}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Trade {mode.weights.trade.toFixed(2)} / Energy{' '}
                  {mode.weights.energy.toFixed(2)} / Shipping{' '}
                  {mode.weights.shipping.toFixed(2)} / Strategic{' '}
                  {mode.weights.strategic.toFixed(2)}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Principles</p>
              <h2 className="panel-title">Guardrails for the model</h2>
            </div>
            <p className="panel-copy">
              These are the rules that keep the product from drifting into vague or
              overconfident output.
            </p>
          </div>

          <div className="space-y-3">
            {methodologyPrinciples.map((principle) => (
              <article key={principle} className="story-card">
                <p className="text-sm leading-7 text-slate-300">{principle}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Assumptions and limits</p>
              <h2 className="panel-title">Model assumptions and known limitations</h2>
            </div>
            <p className="panel-copy">
              These declarations are part of the model contract and are updated as
              realism coverage improves.
            </p>
          </div>

          <div className="space-y-3">
            {simulatorAssumptions.map((item) => (
              <article key={item} className="story-card">
                <p className="eyebrow">Assumption</p>
                <p className="text-sm leading-7 text-slate-300">{item}</p>
              </article>
            ))}
            {simulatorLimitations.map((item) => (
              <article key={item} className="story-card">
                <p className="eyebrow">Limitation</p>
                <p className="text-sm leading-7 text-slate-300">{item}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Calibration checkpoints</p>
            <h2 className="panel-title">Known-episode validation and calibration</h2>
          </div>
          <p className="panel-copy">
            Continuumm validates against directional checkpoints so control gating
            and downstream sensitivity stay coherent with published route realities.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {calibrationEpisodes.map((episode) => (
            <article key={episode.id} className="story-card">
              <p className="eyebrow">Calibration episode</p>
              <h3 className="mt-3 text-2xl text-stone-100">{episode.title}</h3>
              <p className="mono mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                {episode.scenarioLabel}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {episode.summary}
              </p>
              <div className="mt-3 space-y-2">
                {episode.thresholds.map((threshold) => (
                  <p key={threshold} className="text-sm leading-6 text-slate-300">
                    • {threshold}
                  </p>
                ))}
              </div>
            </article>
          ))}

          <article className="story-card md:col-span-2">
            <p className="eyebrow">Calibration data basis</p>
            <h3 className="mt-3 text-2xl text-stone-100">
              Snapshot as of {calibrationSnapshot.asOf}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {calibrationSnapshot.note}
            </p>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {calibrationSnapshot.sources.map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="route-card"
                >
                  <p className="eyebrow">Source</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {source.label}
                  </p>
                </a>
              ))}
            </div>
          </article>

          <article className="story-card md:col-span-2">
            <p className="eyebrow">Prototype coverage boundary</p>
            <h3 className="mt-3 text-2xl text-stone-100">
              {countries.length} countries / {chokepoints.length} chokepoints
            </h3>
            <div className="mt-3 space-y-2">
              {prototypeLimitations.map((item) => (
                <p key={item} className="text-sm leading-6 text-slate-300">
                  • {item}
                </p>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

export default MethodologyPage
