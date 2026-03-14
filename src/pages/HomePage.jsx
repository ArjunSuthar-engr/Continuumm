import { Link } from 'react-router-dom'
import { softwareModules } from '../data/softwareModules'
import { defaultScenarioConfig, simulateConflict } from '../features/simulator'

function HomePage() {
  const snapshot = simulateConflict(defaultScenarioConfig)
  const topCountry = snapshot.topAffected[0]

  return (
    <div className="home-page-shell space-y-10">
      <section className="landing-hero">
        <p className="landing-kicker">Continuumm Platform</p>
        <h1 className="landing-headline">
          Our software powers real-time geopolitical decisions across critical trade
          and energy systems, from maritime routes to domestic markets.
        </h1>
        <div className="landing-actions">
          <Link to="/simulator" className="landing-primary">
            Launch Simulator
          </Link>
          <Link to="/methodology" className="landing-secondary">
            See Methodology
          </Link>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-head">
          <h2>Our Software</h2>
          <p>
            A unified operating surface for conflict scenarios, chokepoint stress,
            and country-level impact interpretation.
          </p>
        </div>

        <div className="software-grid">
          {softwareModules.map((card) => (
            <Link key={card.id} to={card.path} className="software-card software-link-card">
              <div className="software-copy">
                <span>{card.index}</span>
                <p>{card.description}</p>
              </div>

              <div className="software-link-heading">
                <h3>{card.title}</h3>
                <span className="software-link-arrow" aria-hidden="true">
                  {'->'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="section-head">
          <h2>Current Scenario Read</h2>
          <p>
            Default conflict readout shown as a baseline before you run custom
            scenarios.
          </p>
        </div>

        <div className="baseline-grid">
          <article className="baseline-card">
            <p className="baseline-label">Conflict Pair</p>
            <h3>
              {snapshot.aggressor.name} vs {snapshot.defender.name}
            </h3>
          </article>
          <article className="baseline-card">
            <p className="baseline-label">System Stress</p>
            <h3>{snapshot.summary.systemicStress}</h3>
          </article>
          <article className="baseline-card">
            <p className="baseline-label">Fuel Pressure</p>
            <h3>{snapshot.summary.fuelPressure}/100</h3>
          </article>
          <article className="baseline-card">
            <p className="baseline-label">Top Spillover</p>
            <h3>{topCountry?.name ?? '--'}</h3>
          </article>
        </div>
      </section>
    </div>
  )
}

export default HomePage
