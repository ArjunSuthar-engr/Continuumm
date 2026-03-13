import { useState } from 'react'
import { defaultScenarioConfig } from '../data/defaultScenario.js'
import { countries } from '../data/network.js'
import { simulateConflict } from '../lib/simulateConflict.js'

function cloneInitialConfig(initialConfig) {
  return {
    ...initialConfig,
    blockedChokepointIds: [...initialConfig.blockedChokepointIds],
  }
}

function getFallbackCountryId(excludedId) {
  return countries.find((country) => country.id !== excludedId)?.id ?? excludedId
}

export function useConflictScenario(initialConfig = defaultScenarioConfig) {
  const [config, setConfig] = useState(() => cloneInitialConfig(initialConfig))

  function handleCountryChange(kind, value) {
    setConfig((current) => {
      if (kind === 'aggressor') {
        return {
          ...current,
          aggressorId: value,
          defenderId:
            value === current.defenderId
              ? getFallbackCountryId(value)
              : current.defenderId,
        }
      }

      return {
        ...current,
        defenderId: value,
        aggressorId:
          value === current.aggressorId
            ? getFallbackCountryId(value)
            : current.aggressorId,
      }
    })
  }

  function setIntensity(intensity) {
    setConfig((current) => ({
      ...current,
      intensity,
    }))
  }

  function setFocusModeId(focusModeId) {
    setConfig((current) => ({
      ...current,
      focusModeId,
    }))
  }

  function toggleChokepoint(chokepointId) {
    setConfig((current) => ({
      ...current,
      blockedChokepointIds: current.blockedChokepointIds.includes(chokepointId)
        ? current.blockedChokepointIds.filter((id) => id !== chokepointId)
        : [...current.blockedChokepointIds, chokepointId],
    }))
  }

  return {
    ...config,
    scenario: simulateConflict(config),
    handleCountryChange,
    setIntensity,
    setFocusModeId,
    toggleChokepoint,
  }
}
