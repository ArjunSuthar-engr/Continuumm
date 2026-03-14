function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="hero-shell hero-dossier px-5 py-8 sm:px-6 lg:px-8">
        <p className="eyebrow">About</p>
        <h1 className="mt-4 max-w-4xl text-5xl leading-none text-stone-100 sm:text-6xl">
          Continuumm explains how a war between two countries can affect others.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          It visualizes spillover through trade routes, energy flows, shipping
          chokepoints, and downstream domestic effects.
        </p>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="panel-title">Use it in three steps</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="story-card">
            <p className="eyebrow">Step 1</p>
            <h3 className="mt-3 text-2xl text-stone-100">Choose a conflict pair</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Select two countries and set conflict mode, duration, and severity.
            </p>
          </article>
          <article className="story-card">
            <p className="eyebrow">Step 2</p>
            <h3 className="mt-3 text-2xl text-stone-100">Read the map</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Inspect chokepoints and routes to see where disruption can propagate.
            </p>
          </article>
          <article className="story-card">
            <p className="eyebrow">Step 3</p>
            <h3 className="mt-3 text-2xl text-stone-100">Check one country</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Pick a country and lens to view the strongest likely impact channel.
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Reading results</p>
              <h2 className="panel-title">What the scores mean</h2>
            </div>
          </div>

          <div className="space-y-3">
            <article className="story-card">
              <p className="text-sm leading-7 text-slate-300">
                Scores run from 0 to 100. Higher values mean stronger expected
                structural pressure.
              </p>
            </article>
            <article className="story-card">
              <p className="text-sm leading-7 text-slate-300">
                Impact lenses summarize specific channels like oil import shock,
                retail fuel pressure, freight stress, inflation, or electricity.
              </p>
            </article>
            <article className="story-card">
              <p className="text-sm leading-7 text-slate-300">
                Use Quick, Explain, and Analyst depth modes to move from a fast read
                to deeper model detail.
              </p>
            </article>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Limits</p>
              <h2 className="panel-title">What this is not</h2>
            </div>
          </div>

          <div className="space-y-3">
            <article className="story-card">
              <p className="text-sm leading-7 text-slate-300">
                Continuumm is not a future prediction engine. It shows modeled
                vulnerability, not certainty.
              </p>
            </article>
            <article className="story-card">
              <p className="text-sm leading-7 text-slate-300">
                Some data points are observed, some are observed-inferred, and some
                are modelled approximations.
              </p>
            </article>
            <article className="story-card">
              <p className="text-sm leading-7 text-slate-300">
                Always pair these outputs with domain judgment and current policy
                context.
              </p>
            </article>
          </div>
        </section>
      </section>
    </div>
  )
}

export default AboutPage
