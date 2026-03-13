import { useMemo, useState } from 'react'
import {
  buildCountryEffects,
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
    conflictModeId,
    durationId,
    intensity,
    blockedChokepointIds,
    controlMap,
    conflictModes,
    conflictDurations,
    scenario,
    handleCountryChange,
    setConflictModeId,
    setDurationId,
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
        conflictModeId,
        durationId,
        intensity,
        selectedCountryId: effectiveSelectedCountryId,
        blockedChokepointIds,
      }),
    [
      aggressorId,
      defenderId,
      conflictModeId,
      durationId,
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
  const hasControllableRoute = effectPoints.length > 0
  const countryEffects = useMemo(
    () =>
      buildCountryEffects({
        scenario,
        effectPoints,
        selectedCountryId: effectiveSelectedCountryId,
        selectedEffectPointId: effectiveSelectedEffectPointId,
      }),
    [
      scenario,
      effectPoints,
      effectiveSelectedCountryId,
      effectiveSelectedEffectPointId,
    ],
  )

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
            ? `${countryEffects.oneLineSummary} Active chokepoints for this pair: ${effectPoints.length}.`
            : `${scenario.aggressor.name} vs ${scenario.defender.name} has no chokepoint in this model where either belligerent can exert enough control to disrupt transit.`}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Route-data snapshot: {routeDataSnapshot.asOf}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Conflict posture: {scenario.conflictMode.label} | horizon:{' '}
          {scenario.duration.label}
        </p>
      </section>

      <section className="simulator-three-pane">
        <WarSetupPanel
          aggressorId={aggressorId}
          defenderId={defenderId}
          conflictModeId={conflictModeId}
          durationId={durationId}
          intensity={intensity}
          blockedChokepointIds={blockedChokepointIds}
          controlMap={controlMap}
          conflictModes={conflictModes}
          conflictDurations={conflictDurations}
          onCountryChange={handleWarCountryChange}
          onConflictModeChange={setConflictModeId}
          onDurationChange={setDurationId}
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
          countryEffects={countryEffects}
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
