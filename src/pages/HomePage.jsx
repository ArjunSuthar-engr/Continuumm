import { Link } from 'react-router-dom'
import { documentationEntries } from '../data/documentationEntries'
import { siteSections } from '../data/projectContent'
import { defaultScenarioConfig, simulateConflict } from '../features/simulator'

function HomePage() {
  const snapshot = simulateConflict(defaultScenarioConfig)
  const latestLog = documentationEntries[0]

  return (
    <div className="space-y-6">
      <section className="hero-shell hero-command px-5 py-9 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="max-w-4xl">
            <p className="eyebrow">Home / Theater briefing</p>
            <h1 className="hero-title mt-4 max-w-5xl text-5xl leading-none text-stone-100 sm:text-6xl xl:text-7xl">
              The world does not break at the frontline.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Continuumm maps how conflict between two countries can propagate
              through fuel routes, trade corridors, and strategic chokepoints. This
              is an operations interface for structural vulnerability, not a black-box
              forecast.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/simulator" className="route-cta">
                Enter Theater
              </Link>
              <Link to="/methodology" className="nav-link">
                Read Methodology
              </Link>
            </div>
          </div>

          <div className="dispatch-column">
            <article className="dispatch-card">
              <p className="eyebrow">Latest dispatch</p>
              <h2 className="mt-3 text-3xl leading-none text-stone-100">
                {latestLog.label}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {latestLog.title}
              </p>
            </article>
            <article className="dispatch-card">
              <p className="eyebrow">Current scenario signal</p>
              <div className="mt-4 grid gap-3">
                <div className="signal-row">
                  <span className="signal-row-label">System stress</span>
                  <strong className="signal-row-value">
                    {snapshot.summary.systemicStress}
                  </strong>
                </div>
                <div className="signal-row">
                  <span className="signal-row-label">Fuel pressure</span>
                  <strong className="signal-row-value">
                    {snapshot.summary.fuelPressure}/100
                  </strong>
                </div>
                <div className="signal-row">
                  <span className="signal-row-label">Top spillover</span>
                  <strong className="signal-row-value">
                    {snapshot.topAffected[0].name}
                  </strong>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div className="briefing-strip mt-8 grid gap-3 md:grid-cols-3">
          <article className="briefing-chip">
            <p className="eyebrow">Mission doctrine</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Structural analysis over deterministic prediction.
            </p>
          </article>
          <article className="briefing-chip">
            <p className="eyebrow">Primary lens</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Trade, energy, shipping, and alliance stress in one theater view.
            </p>
          </article>
          <article className="briefing-chip">
            <p className="eyebrow">Default conflict pair</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {snapshot.aggressor.name} vs {snapshot.defender.name}
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Snapshot scenario</p>
              <h2 className="panel-title">Current theater readout</h2>
            </div>
            <p className="panel-copy">
              A default China vs. United States scenario is used here to show the
              initial spillover structure and the kind of reading the simulator can
              generate.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="story-card">
              <p className="eyebrow">Systemic stress</p>
              <h3 className="mt-3 text-3xl text-stone-100">
                {snapshot.summary.systemicStress}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The current seed model classifies the top-spillover zone based on
                aggregated exposure across the most affected external countries.
              </p>
            </article>
            <article className="story-card">
              <p className="eyebrow">Fuel pressure</p>
              <h3 className="mt-3 text-3xl text-stone-100">
                {snapshot.summary.fuelPressure}/100
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Energy shock rises quickly when Hormuz and Malacca are already under
                strain.
              </p>
            </article>
            <article className="story-card">
              <p className="eyebrow">Top spillover</p>
              <h3 className="mt-3 text-3xl text-stone-100">
                {snapshot.topAffected[0].name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The simulator ranks external states by total downstream pressure once
                the two belligerents are removed from the result set.
              </p>
            </article>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Primary surfaces</p>
              <h2 className="panel-title">Operational surfaces</h2>
            </div>
            <p className="panel-copy">
              Each page owns a clear responsibility, which keeps editing tighter and
              reduces accidental sprawl.
            </p>
          </div>

          <div className="grid gap-3">
            {siteSections.map((section) => (
              <Link key={section.id} to={section.to} className="route-card">
                <p className="eyebrow">{section.label}</p>
                <h3 className="mt-3 text-2xl text-stone-100">{section.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Most exposed in the snapshot</p>
              <h2 className="panel-title">External pressure ranking</h2>
            </div>
            <p className="panel-copy">
              These are the top three third countries from the current default
              scenario.
            </p>
          </div>

          <div className="space-y-3">
            {snapshot.topAffected.slice(0, 3).map((country, index) => (
              <article key={country.id} className="story-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">0{index + 1}</p>
                    <h3 className="mt-2 text-2xl text-stone-100">{country.name}</h3>
                    <p className="mt-2 text-sm text-slate-400">{country.region}</p>
                  </div>
                  <strong className="text-3xl text-amber-100">
                    {country.totalScore}
                  </strong>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  {country.narrative}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Intent</p>
              <h2 className="panel-title">Continuumm build intent</h2>
            </div>
            <p className="panel-copy">
              The near-term goal is not a finished intelligence platform. It is a
              defensible, explainable, and visually strong simulator foundation.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="story-card">
              <p className="eyebrow">Visual direction</p>
              <h3 className="mt-3 text-2xl text-stone-100">
                Maritime, tense, restrained
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The site leans into steel blue water, fog, muted sand, and command
                table composition rather than a soft SaaS dashboard look.
              </p>
            </article>
            <article className="story-card">
              <p className="eyebrow">Model direction</p>
              <h3 className="mt-3 text-2xl text-stone-100">
                Structural, not predictive
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Users should understand why a country is exposed, not just receive a
                black-box score.
              </p>
            </article>
            <article className="story-card md:col-span-2">
              <p className="eyebrow">Build process</p>
              <h3 className="mt-3 text-2xl text-stone-100">
                Each milestone gets a visible public log entry
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The Documentation page is now part of the product. After each
                shipped commit, we can append a user-facing update there and keep
                deeper local notes in `.continuumm/`.
              </p>
            </article>
          </div>
        </section>
      </section>
    </div>
  )
}

export default HomePage
