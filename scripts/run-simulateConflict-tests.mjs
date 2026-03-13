import assert from 'node:assert/strict'
import { buildCountryEffects } from '../src/features/simulator/lib/buildCountryEffects.js'
import { buildEffectPoints } from '../src/features/simulator/lib/buildEffectPoints.js'
import { deriveConflictChokepoints } from '../src/features/simulator/lib/deriveConflictChokepoints.js'
import { getCountrySecondaryProfile } from '../src/features/simulator/data/countrySecondaryProfiles.js'
import {
  getConflictChokepointControl,
  getCountryRouteAugmenters,
  getCountryRouteDependence,
} from '../src/features/simulator/data/routeReality.js'
import { simulateConflict } from '../src/features/simulator/lib/simulateConflict.js'

function runTest(name, testFn) {
  try {
    testFn()
    console.log(`PASS ${name}`)
  } catch (error) {
    console.error(`FAIL ${name}`)
    throw error
  }
}

runTest('excludes belligerents from the affected-country ranking', () => {
  const scenario = simulateConflict({
    aggressorId: 'china',
    defenderId: 'united-states',
    focusModeId: 'balanced',
    intensity: 68,
    blockedChokepointIds: ['hormuz', 'malacca'],
  })

  assert.equal(scenario.results.length, scenario.countries.length - 2)
  assert.equal(
    scenario.results.some((country) => country.id === 'china'),
    false,
  )
  assert.equal(
    scenario.results.some((country) => country.id === 'united-states'),
    false,
  )
  assert.equal(scenario.topAffected.length, 5)
  assert.equal(
    scenario.results[0].totalScore >= scenario.results[1].totalScore,
    true,
  )
})

runTest('raises system stress when intensity and chokepoint disruption increase', () => {
  const contained = simulateConflict({
    aggressorId: 'china',
    defenderId: 'united-states',
    focusModeId: 'balanced',
    intensity: 30,
    blockedChokepointIds: [],
  })
  const escalated = simulateConflict({
    aggressorId: 'china',
    defenderId: 'united-states',
    focusModeId: 'balanced',
    intensity: 85,
    blockedChokepointIds: ['hormuz', 'malacca', 'suez'],
  })

  assert.equal(
    escalated.summary.detourMiles > contained.summary.detourMiles,
    true,
  )
  assert.equal(
    escalated.summary.fuelPressure > contained.summary.fuelPressure,
    true,
  )
  assert.equal(
    escalated.summary.averageScore > contained.summary.averageScore,
    true,
  )
})

runTest('changes channel emphasis when the analytical focus changes', () => {
  const balanced = simulateConflict({
    aggressorId: 'china',
    defenderId: 'united-states',
    focusModeId: 'balanced',
    intensity: 68,
    blockedChokepointIds: ['hormuz', 'malacca'],
  })
  const energy = simulateConflict({
    aggressorId: 'china',
    defenderId: 'united-states',
    focusModeId: 'energy',
    intensity: 68,
    blockedChokepointIds: ['hormuz', 'malacca'],
  })
  const maritime = simulateConflict({
    aggressorId: 'china',
    defenderId: 'united-states',
    focusModeId: 'maritime',
    intensity: 68,
    blockedChokepointIds: ['hormuz', 'malacca'],
  })

  assert.equal(
    energy.channelPressure.energy > balanced.channelPressure.energy,
    true,
  )
  assert.equal(
    maritime.channelPressure.shipping > balanced.channelPressure.shipping,
    true,
  )
})

runTest('conflict mode modifies route-driven channel stress', () => {
  const blockade = simulateConflict({
    aggressorId: 'israel',
    defenderId: 'iran',
    focusModeId: 'energy',
    conflictModeId: 'blockade',
    durationId: '2m',
    intensity: 76,
    blockedChokepointIds: ['hormuz', 'bab-el-mandeb', 'suez'],
  })
  const sanctions = simulateConflict({
    aggressorId: 'israel',
    defenderId: 'iran',
    focusModeId: 'energy',
    conflictModeId: 'sanctions',
    durationId: '2m',
    intensity: 76,
    blockedChokepointIds: ['hormuz', 'bab-el-mandeb', 'suez'],
  })

  assert.equal(
    blockade.channelPressure.shipping > sanctions.channelPressure.shipping,
    true,
  )
  assert.equal(
    sanctions.channelPressure.trade >= blockade.channelPressure.trade,
    true,
  )
})

runTest('longer conflict duration raises total stress for same setup', () => {
  const shortHorizon = simulateConflict({
    aggressorId: 'israel',
    defenderId: 'iran',
    focusModeId: 'energy',
    conflictModeId: 'strikes',
    durationId: '2w',
    intensity: 76,
    blockedChokepointIds: ['hormuz', 'bab-el-mandeb', 'suez'],
  })
  const longHorizon = simulateConflict({
    aggressorId: 'israel',
    defenderId: 'iran',
    focusModeId: 'energy',
    conflictModeId: 'strikes',
    durationId: '6m',
    intensity: 76,
    blockedChokepointIds: ['hormuz', 'bab-el-mandeb', 'suez'],
  })

  assert.equal(
    longHorizon.summary.averageScore > shortHorizon.summary.averageScore,
    true,
  )
  assert.equal(
    longHorizon.summary.detourMiles > shortHorizon.summary.detourMiles,
    true,
  )
})

runTest('secondary effects include required channels with confidence and basis', () => {
  const blockedChokepointIds = deriveConflictChokepoints({
    aggressorId: 'israel',
    defenderId: 'iran',
    conflictModeId: 'strikes',
    durationId: '2m',
    intensity: 76,
  })
  const scenario = simulateConflict({
    aggressorId: 'israel',
    defenderId: 'iran',
    focusModeId: 'energy',
    conflictModeId: 'strikes',
    durationId: '2m',
    intensity: 76,
    blockedChokepointIds,
  })
  const effectPoints = buildEffectPoints({
    aggressorId: 'israel',
    defenderId: 'iran',
    conflictModeId: 'strikes',
    durationId: '2m',
    intensity: 76,
    selectedCountryId: 'india',
    blockedChokepointIds,
  })

  const countryEffects = buildCountryEffects({
    scenario,
    effectPoints,
    selectedCountryId: 'india',
    selectedEffectPointId: effectPoints[0]?.id ?? null,
  })

  assert.equal(countryEffects.primaryEffects.length >= 2, true)
  assert.equal(countryEffects.secondaryEffects.length >= 5, true)
  assert.equal(
    countryEffects.secondaryEffects.some((effect) => effect.id === 'secondary-fuel-retail'),
    true,
  )
  assert.equal(
    countryEffects.secondaryEffects.some((effect) => effect.id === 'secondary-electricity'),
    true,
  )
  assert.equal(
    countryEffects.secondaryEffects.every(
      (effect) => Boolean(effect.confidence) && Boolean(effect.dataBasis),
    ),
    true,
  )
})

runTest('india electricity effect remains lower than retail fuel effect under hormuz stress', () => {
  const blockedChokepointIds = deriveConflictChokepoints({
    aggressorId: 'israel',
    defenderId: 'iran',
    conflictModeId: 'blockade',
    durationId: '2m',
    intensity: 80,
  })
  const scenario = simulateConflict({
    aggressorId: 'israel',
    defenderId: 'iran',
    focusModeId: 'energy',
    conflictModeId: 'blockade',
    durationId: '2m',
    intensity: 80,
    blockedChokepointIds,
  })
  const effectPoints = buildEffectPoints({
    aggressorId: 'israel',
    defenderId: 'iran',
    conflictModeId: 'blockade',
    durationId: '2m',
    intensity: 80,
    selectedCountryId: 'india',
    blockedChokepointIds,
  })
  const countryEffects = buildCountryEffects({
    scenario,
    effectPoints,
    selectedCountryId: 'india',
    selectedEffectPointId: effectPoints[0]?.id ?? null,
  })
  const fuel = countryEffects.secondaryEffects.find(
    (effect) => effect.id === 'secondary-fuel-retail',
  )
  const power = countryEffects.secondaryEffects.find(
    (effect) => effect.id === 'secondary-electricity',
  )

  assert.equal(Boolean(fuel), true)
  assert.equal(Boolean(power), true)
  assert.equal(fuel.score > power.score, true)
})

runTest('route dependence coverage includes observed-inferred entries beyond hormuz', () => {
  const indiaSuez = getCountryRouteDependence('india', 'suez')
  const chinaMalacca = getCountryRouteDependence('china', 'malacca')

  assert.equal(indiaSuez.sharePct > 0, true)
  assert.equal(chinaMalacca.sharePct > 0, true)
  assert.equal(
    ['observed', 'observed-inferred'].includes(indiaSuez.basis),
    true,
  )
  assert.equal(
    ['observed', 'observed-inferred'].includes(chinaMalacca.basis),
    true,
  )
})

runTest('country route augmenters and macro coefficients are present for secondary modelling', () => {
  const augmenters = getCountryRouteAugmenters('india')
  const profile = getCountrySecondaryProfile('india')

  assert.equal(augmenters.pipelineBypassPct.value > 0, true)
  assert.equal(augmenters.lngImportExposurePct.value > 0, true)
  assert.equal(augmenters.portConcentrationScore.value > 0, true)

  assert.equal(profile.fuelPassThrough.value > 0, true)
  assert.equal(profile.inflationSensitivity.value > 0, true)
  assert.equal(profile.currencyPassThrough.value > 0, true)
  assert.equal(profile.policyBufferScore.value > 0, true)
})

runTest('effect-point metadata includes route augmenter fields', () => {
  const blockedChokepointIds = deriveConflictChokepoints({
    aggressorId: 'israel',
    defenderId: 'iran',
    conflictModeId: 'blockade',
    durationId: '2m',
    intensity: 80,
  })
  const effectPoints = buildEffectPoints({
    aggressorId: 'israel',
    defenderId: 'iran',
    conflictModeId: 'blockade',
    durationId: '2m',
    intensity: 80,
    selectedCountryId: 'india',
    blockedChokepointIds,
  })

  assert.equal(effectPoints.length > 0, true)
  const point = effectPoints[0]

  assert.equal(typeof point.routeShareRawPct, 'number')
  assert.equal(typeof point.pipelineBypassPct, 'number')
  assert.equal(typeof point.lngImportExposurePct, 'number')
  assert.equal(typeof point.portConcentrationScore, 'number')
  assert.equal(point.routeShareRawPct >= point.modelledImportShare, true)
})

runTest('suez control threshold flips across escalation posture for israel-iran pair', () => {
  const lowPosture = getConflictChokepointControl({
    aggressorId: 'israel',
    defenderId: 'iran',
    chokepointId: 'suez',
    intensity: 55,
    conflictModeId: 'sanctions',
    durationId: '2w',
  })
  const highPosture = getConflictChokepointControl({
    aggressorId: 'israel',
    defenderId: 'iran',
    chokepointId: 'suez',
    intensity: 95,
    conflictModeId: 'blockade',
    durationId: '6m',
  })

  assert.equal(lowPosture.canDisrupt, false)
  assert.equal(highPosture.canDisrupt, true)
  assert.equal(lowPosture.effectiveScore < lowPosture.threshold, true)
  assert.equal(highPosture.effectiveScore >= highPosture.threshold, true)
  assert.equal(
    Math.round((highPosture.effectiveScore - lowPosture.effectiveScore) * 100) >= 15,
    true,
  )
})

runTest('non-controller conflict pair yields no disruptable chokepoints', () => {
  const blocked = deriveConflictChokepoints({
    aggressorId: 'india',
    defenderId: 'germany',
    conflictModeId: 'blockade',
    durationId: '6m',
    intensity: 95,
  })

  assert.equal(blocked.length, 0)
})

runTest('hormuz calibration: india fuel pressure stays materially above electricity', () => {
  const blockedChokepointIds = deriveConflictChokepoints({
    aggressorId: 'israel',
    defenderId: 'iran',
    conflictModeId: 'blockade',
    durationId: '2m',
    intensity: 80,
  })
  const scenario = simulateConflict({
    aggressorId: 'israel',
    defenderId: 'iran',
    focusModeId: 'energy',
    conflictModeId: 'blockade',
    durationId: '2m',
    intensity: 80,
    blockedChokepointIds,
  })
  const effectPoints = buildEffectPoints({
    aggressorId: 'israel',
    defenderId: 'iran',
    conflictModeId: 'blockade',
    durationId: '2m',
    intensity: 80,
    selectedCountryId: 'india',
    blockedChokepointIds,
  })
  const hormuzPoint = effectPoints.find((point) => point.id === 'hormuz')

  assert.equal(Boolean(hormuzPoint), true)
  assert.equal(hormuzPoint.modelledImportShare >= 30, true)

  const countryEffects = buildCountryEffects({
    scenario,
    effectPoints,
    selectedCountryId: 'india',
    selectedEffectPointId: hormuzPoint.id,
  })
  const fuel = countryEffects.secondaryEffects.find(
    (effect) => effect.id === 'secondary-fuel-retail',
  )
  const power = countryEffects.secondaryEffects.find(
    (effect) => effect.id === 'secondary-electricity',
  )

  assert.equal(Boolean(fuel), true)
  assert.equal(Boolean(power), true)
  assert.equal(fuel.score >= 58, true)
  assert.equal(fuel.score - power.score >= 18, true)
})

runTest('blockade posture produces stronger maritime system stress than sanctions posture', () => {
  const blockadeBlocked = deriveConflictChokepoints({
    aggressorId: 'israel',
    defenderId: 'iran',
    conflictModeId: 'blockade',
    durationId: '2m',
    intensity: 80,
  })
  const sanctionsBlocked = deriveConflictChokepoints({
    aggressorId: 'israel',
    defenderId: 'iran',
    conflictModeId: 'sanctions',
    durationId: '2m',
    intensity: 80,
  })

  const blockadeScenario = simulateConflict({
    aggressorId: 'israel',
    defenderId: 'iran',
    focusModeId: 'energy',
    conflictModeId: 'blockade',
    durationId: '2m',
    intensity: 80,
    blockedChokepointIds: blockadeBlocked,
  })
  const sanctionsScenario = simulateConflict({
    aggressorId: 'israel',
    defenderId: 'iran',
    focusModeId: 'energy',
    conflictModeId: 'sanctions',
    durationId: '2m',
    intensity: 80,
    blockedChokepointIds: sanctionsBlocked,
  })

  const blockadePoints = buildEffectPoints({
    aggressorId: 'israel',
    defenderId: 'iran',
    conflictModeId: 'blockade',
    durationId: '2m',
    intensity: 80,
    selectedCountryId: 'india',
    blockedChokepointIds: blockadeBlocked,
  })
  const sanctionsPoints = buildEffectPoints({
    aggressorId: 'israel',
    defenderId: 'iran',
    conflictModeId: 'sanctions',
    durationId: '2m',
    intensity: 80,
    selectedCountryId: 'india',
    blockedChokepointIds: sanctionsBlocked,
  })

  assert.equal(blockadePoints.length >= sanctionsPoints.length, true)
  assert.equal(blockadeBlocked.includes('bab-el-mandeb'), true)
  assert.equal(sanctionsBlocked.includes('bab-el-mandeb'), false)
  assert.equal(
    blockadeScenario.channelPressure.shipping >
      sanctionsScenario.channelPressure.shipping,
    true,
  )
  assert.equal(
    blockadeScenario.summary.detourMiles > sanctionsScenario.summary.detourMiles,
    true,
  )
})

console.log('All simulator checks passed.')
