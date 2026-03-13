import { focusModes, chokepoints, countries } from '../features/simulator'
import {
  channelDescriptions,
  limitations,
  methodologyPrinciples,
  methodologySteps,
} from '../data/projectContent'

function MethodologyPage() {
  return (
    <div className="space-y-6">
      <section className="hero-shell px-5 py-8 sm:px-6 lg:px-8">
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
              <p className="eyebrow">Current constraints</p>
              <h2 className="panel-title">What the prototype does not yet model</h2>
            </div>
            <p className="panel-copy">
              This matters because product trust depends as much on declared limits
              as on visual confidence.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {limitations.map((item) => (
              <article key={item} className="story-card">
                <p className="text-sm leading-7 text-slate-300">{item}</p>
              </article>
            ))}
            <article className="story-card md:col-span-2">
              <p className="eyebrow">Seed network size</p>
              <h3 className="mt-3 text-2xl text-stone-100">
                {countries.length} countries / {chokepoints.length} chokepoints
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The current prototype is deliberately small so the model remains
                explainable while the visual system is still being shaped.
              </p>
            </article>
          </div>
        </section>
      </section>
    </div>
  )
}

export default MethodologyPage
