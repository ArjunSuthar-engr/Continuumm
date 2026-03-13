import { useEffect, useRef, useState } from 'react'
import { defaultScenarioConfig } from '../data/defaultScenario.js'
import { countries, countriesById } from '../data/network.js'
import { defaultPresetId, scenarioPresets } from '../data/scenarioPresets.js'
import { deriveConflictChokepoints } from '../lib/deriveConflictChokepoints.js'
import { fetchLiveSignalsSnapshot } from '../lib/fetchLiveSignals.js'
import { simulateConflict } from '../lib/simulateConflict.js'

function cloneInitialConfig(initialConfig) {
  const baseConfig = {
    ...initialConfig,
    blockedChokepointIds: [...initialConfig.blockedChokepointIds],
  }

  return {
    ...baseConfig,
    blockedChokepointIds: deriveConflictChokepoints({
      aggressorId: baseConfig.aggressorId,
      defenderId: baseConfig.defenderId,
      intensity: baseConfig.intensity,
    }),
  }
}

function getFallbackCountryId(excludedId) {
  return countries.find((country) => country.id !== excludedId)?.id ?? excludedId
}

export function useConflictScenario(
  initialConfig = defaultScenarioConfig,
  options = {},
) {
  const enableLive = options.enableLive ?? true
  const [config, setConfig] = useState(() => cloneInitialConfig(initialConfig))
  const [activePresetId, setActivePresetId] = useState(defaultPresetId)
  const [liveOverlayEnabled, setLiveOverlayEnabled] = useState(enableLive)
  const [liveSignals, setLiveSignals] = useState(null)
  const [liveStatus, setLiveStatus] = useState('idle')
  const [liveError, setLiveError] = useState('')
  const requestSequenceRef = useRef(0)

  function handleCountryChange(kind, value) {
    setActivePresetId(null)
    setConfig((current) => {
      if (kind === 'aggressor') {
        const next = {
          ...current,
          aggressorId: value,
          defenderId:
            value === current.defenderId
              ? getFallbackCountryId(value)
              : current.defenderId,
        }

        return {
          ...next,
          blockedChokepointIds: deriveConflictChokepoints({
            aggressorId: next.aggressorId,
            defenderId: next.defenderId,
            intensity: next.intensity,
          }),
        }
      }

      const next = {
        ...current,
        defenderId: value,
        aggressorId:
          value === current.aggressorId
            ? getFallbackCountryId(value)
            : current.aggressorId,
      }

      return {
        ...next,
        blockedChokepointIds: deriveConflictChokepoints({
          aggressorId: next.aggressorId,
          defenderId: next.defenderId,
          intensity: next.intensity,
        }),
      }
    })
  }

  function setIntensity(intensity) {
    setActivePresetId(null)
    setConfig((current) => ({
      ...current,
      intensity,
      blockedChokepointIds: deriveConflictChokepoints({
        aggressorId: current.aggressorId,
        defenderId: current.defenderId,
        intensity,
      }),
    }))
  }

  function setFocusModeId(focusModeId) {
    setActivePresetId(null)
    setConfig((current) => ({
      ...current,
      focusModeId,
    }))
  }

  function toggleChokepoint(chokepointId) {
    setActivePresetId(null)
    setConfig((current) => ({
      ...current,
      blockedChokepointIds: current.blockedChokepointIds.includes(chokepointId)
        ? current.blockedChokepointIds.filter((id) => id !== chokepointId)
        : [...current.blockedChokepointIds, chokepointId],
      }))
  }

  async function refreshLiveSignals(options = {}) {
    if (!enableLive) {
      return null
    }

    const requestId = requestSequenceRef.current + 1
    requestSequenceRef.current = requestId
    setLiveStatus('loading')
    setLiveError('')

    const aggressorId = options.aggressorId ?? config.aggressorId
    const defenderId = options.defenderId ?? config.defenderId
    const contextActorIds = options.contextActorIds ?? []

    const aggressorName = countriesById[aggressorId]?.name
    const defenderName = countriesById[defenderId]?.name
    const contextActors = contextActorIds
      .map((id) => countriesById[id]?.name)
      .filter(Boolean)

    try {
      const snapshot = await fetchLiveSignalsSnapshot({
        aggressorName,
        defenderName,
        contextActors,
      })

      if (requestSequenceRef.current !== requestId) {
        return null
      }

      setLiveSignals(snapshot)
      setLiveStatus(snapshot.sourceHealth === 'live' ? 'ready' : 'partial')
      return snapshot
    } catch {
      if (requestSequenceRef.current !== requestId) {
        return null
      }

      setLiveStatus('error')
      setLiveError(
        'Live API feeds did not return a valid response. The simulator is still running on structural seed data.',
      )
      return null
    }
  }

  function applyPreset(presetId) {
    const preset = scenarioPresets.find((candidate) => candidate.id === presetId)

    if (!preset) {
      return
    }

    setActivePresetId(preset.id)
    setConfig((current) => ({
      ...current,
      ...preset.config,
      blockedChokepointIds: deriveConflictChokepoints({
        aggressorId: preset.config.aggressorId,
        defenderId: preset.config.defenderId,
        intensity: preset.config.intensity,
      }),
    }))

    if (enableLive) {
      refreshLiveSignals({
        aggressorId: preset.config.aggressorId,
        defenderId: preset.config.defenderId,
        contextActorIds: preset.contextActorIds,
      })
    }
  }

  function applyLiveSuggestions() {
    if (!liveSignals?.suggestedAdjustments) {
      return
    }

    const suggested = liveSignals.suggestedAdjustments

    setConfig((current) => ({
      ...current,
      intensity: suggested.intensity ?? current.intensity,
      focusModeId: suggested.focusModeId ?? current.focusModeId,
      blockedChokepointIds:
        suggested.blockedChokepointIds?.length > 0
          ? [...new Set([...current.blockedChokepointIds, ...suggested.blockedChokepointIds])]
          : current.blockedChokepointIds,
    }))
    setLiveOverlayEnabled(true)
  }

  useEffect(() => {
    if (!enableLive) {
      return
    }

    const initialPreset = scenarioPresets.find(
      (candidate) => candidate.id === defaultPresetId,
    )
    const contextActorIds = initialPreset?.contextActorIds ?? []

    refreshLiveSignals({
      aggressorId: config.aggressorId,
      defenderId: config.defenderId,
      contextActorIds,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    ...config,
    scenario: simulateConflict({
      ...config,
      liveSignals: enableLive && liveOverlayEnabled ? liveSignals : null,
    }),
    presets: scenarioPresets,
    activePresetId,
    handleCountryChange,
    setIntensity,
    setFocusModeId,
    toggleChokepoint,
    liveSignals,
    liveStatus,
    liveError,
    liveOverlayEnabled,
    setLiveOverlayEnabled,
    refreshLiveSignals,
    applyPreset,
    applyLiveSuggestions,
  }
}
