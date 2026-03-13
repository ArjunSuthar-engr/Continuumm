import { Link } from 'react-router-dom'
import { documentationEntries } from '../data/documentationEntries'
import { siteSections } from '../data/projectContent'
import {
  defaultScenarioConfig,
  simulateConflict,
} from '../features/simulator'

function HomePage() {
  const snapshot = simulateConflict(defaultScenarioConfig)
  const latestLog = documentationEntries[0]

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(7,17,26,0.94),rgba(11,32,46,0.82)_55%,rgba(164,112,68,0.18))] px-5 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr] xl:items-end">
          <div className="max-w-4xl">
            <p className="eyebrow">Home / Continuumm</p>
            <h1 className="mt-4 max-w-4xl text-5xl leading-none text-stone-100 sm:text-6xl xl:text-7xl">
              A geopolitical impact simulator for a world tied together by trade,
              fuel, and fragile sea lanes.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Continuumm is designed to show how conflict between any two countries
              can radiate into distant economies through chokepoints, shipping
              detours, energy shocks, and strategic realignment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/simulator" className="route-cta">
                Enter Simulator
              </Link>
              <Link to="/methodology" className="nav-link">
                Read Methodology
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            <article className="metric-card">
              <span className="metric-label">Current prototype</span>
              <strong className="metric-value">Multi-page architecture</strong>
              <p className="metric-copy">
                The site is now split into product pages so simulator work,
                methodology, and project history can evolve independently.
              </p>
            </article>
            <article className="metric-card">
              <span className="metric-label">Latest public update</span>
              <strong className="metric-value">{latestLog.title}</strong>
              <p className="metric-copy">{latestLog.summary}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Snapshot scenario</p>
              <h2 className="panel-title">What the current prototype already shows</h2>
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
              <h2 className="panel-title">How the website is now divided</h2>
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
              <h2 className="panel-title">What Continuumm is trying to become</h2>
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
