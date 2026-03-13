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
    <div className="simulator-three-pane">
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
    </div>
  )
}

export default SimulatorPage
