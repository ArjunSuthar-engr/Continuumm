import { Link } from 'react-router-dom'
import { defaultScenarioConfig, simulateConflict } from '../features/simulator'

const softwareCards = [
  {
    id: 'spillover-core',
    title: 'Spillover Core',
    description:
      'Model second-order impact from one conflict pair into third-country economic and strategic pressure.',
    index: '/0.1',
  },
  {
    id: 'route-pressure',
    title: 'Route Pressure',
    description:
      'Track chokepoint congestion risk across canals and straits that amplify shipping and energy shock.',
    index: '/0.2',
  },
  {
    id: 'country-brief',
    title: 'Country Brief',
    description:
      'Inspect why one selected country moves, with transparent channel-level pressure drivers.',
    index: '/0.3',
  },
]

function HomePage() {
  const snapshot = simulateConflict(defaultScenarioConfig)
  const topCountry = snapshot.topAffected[0]

  return (
    <div className="space-y-10">
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
          {softwareCards.map((card) => (
            <article key={card.id} className="software-card">
              <div className="software-copy">
                <p>{card.description}</p>
                <span>{card.index}</span>
              </div>
              <h3>{card.title}</h3>
            </article>
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
