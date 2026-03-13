import assert from 'node:assert/strict'
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

console.log('All simulator checks passed.')
