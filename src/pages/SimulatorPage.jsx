import { useMemo, useState } from 'react'
import {
  buildEffectPoints,
  CountryImpactPanel,
  RippleBoard,
  routeDataSnapshot,
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
  const effectPoints = useMemo(
    () =>
      buildEffectPoints({
        aggressorId,
        defenderId,
        intensity,
        selectedCountryId: effectiveSelectedCountryId,
        blockedChokepointIds,
      }),
    [
      aggressorId,
      defenderId,
      intensity,
      effectiveSelectedCountryId,
      blockedChokepointIds,
    ],
  )
  const effectiveSelectedEffectPointId = effectPoints.some(
    (point) => point.id === selectedChokepointId,
  )
    ? selectedChokepointId
    : effectPoints[0]?.id ?? null
  const selectedCountryName =
    scenario.countries.find((country) => country.id === effectiveSelectedCountryId)
      ?.name ?? 'Selected country'
  const selectedEffectPoint = effectPoints.find(
    (point) => point.id === effectiveSelectedEffectPointId,
  )
  const hasControllableRoute = effectPoints.length > 0

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
        <p className="mt-4 text-sm leading-7 text-slate-300">
          {hasControllableRoute
            ? `${selectedCountryName} currently tracks ${effectPoints.length} controllable effect points. Top pressure node: ${selectedEffectPoint?.name ?? 'n/a'}.`
            : `${scenario.aggressor.name} vs ${scenario.defender.name} has no chokepoint in this model where either belligerent can exert enough control to disrupt transit.`}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Route-data snapshot: {routeDataSnapshot.asOf} (observed inputs + explicit
          model assumptions).
        </p>
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
          effectPoints={effectPoints}
          selectedCountryId={effectiveSelectedCountryId}
          onSelectCountry={handleMapCountrySelect}
          selectedEffectPointId={effectiveSelectedEffectPointId}
          onSelectChokepoint={handleChokepointSelect}
        />

        <CountryImpactPanel
          scenario={scenario}
          effectPoints={effectPoints}
          selectedCountryId={effectiveSelectedCountryId}
          selectedEffectPointId={effectiveSelectedEffectPointId}
          onEffectPointSelect={handleChokepointSelect}
          onCountrySelect={setSelectedCountryId}
        />
      </section>
    </div>
  )
}

export default SimulatorPage
