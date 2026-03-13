import { useState } from 'react'
import {
  CountryImpactPanel,
  RippleBoard,
  WarSetupPanel,
  useConflictScenario,
} from '../features/simulator'

function SimulatorPage() {
  const {
    aggressorId,
    defenderId,
    intensity,
    blockedChokepointIds,
    scenario,
    handleCountryChange,
    setIntensity,
  } = useConflictScenario(undefined, { enableLive: false })

  const [selectedCountryId, setSelectedCountryId] = useState(
    scenario.topAffected[0]?.id ?? scenario.aggressor.id,
  )
  const [selectedChokepointId, setSelectedChokepointId] = useState(null)
  const effectiveSelectedCountryId = scenario.countries.some(
    (country) => country.id === selectedCountryId,
  )
    ? selectedCountryId
    : scenario.topAffected[0]?.id ?? scenario.aggressor.id

  function handleWarCountryChange(kind, value) {
    handleCountryChange(kind, value)
    setSelectedChokepointId(null)
  }

  function handleMapCountrySelect(countryId) {
    setSelectedCountryId(countryId)
    setSelectedChokepointId(null)
  }

  function handleChokepointSelect(chokepointId) {
    setSelectedChokepointId((current) =>
      current === chokepointId ? null : chokepointId,
    )
  }

  return (
    <div className="space-y-6">
      <section className="simulator-intro">
        <p className="landing-kicker">Scenario Workspace</p>
        <h1 className="simulator-headline">
          Simulate conflict spillover across global trade and strategic routes.
        </h1>
      </section>

      <section className="simulator-three-pane">
        <WarSetupPanel
          aggressorId={aggressorId}
          defenderId={defenderId}
          intensity={intensity}
          blockedChokepointIds={blockedChokepointIds}
          onCountryChange={handleWarCountryChange}
          onIntensityChange={setIntensity}
        />

        <RippleBoard
          scenario={scenario}
          blockedChokepointIds={blockedChokepointIds}
          selectedCountryId={effectiveSelectedCountryId}
          onSelectCountry={handleMapCountrySelect}
          selectedChokepointId={selectedChokepointId}
          onSelectChokepoint={handleChokepointSelect}
        />

        <CountryImpactPanel
          scenario={scenario}
          selectedCountryId={effectiveSelectedCountryId}
          onCountrySelect={setSelectedCountryId}
        />
      </section>
    </div>
  )
}

export default SimulatorPage
