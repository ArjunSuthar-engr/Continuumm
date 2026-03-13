const GDELT_ENDPOINT = 'https://api.gdeltproject.org/api/v2/doc/doc'
const EIA_ENDPOINT = 'https://api.eia.gov/v2/petroleum/pri/spt/data/'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function average(values) {
  if (!values.length) {
    return 0
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

async function fetchJson(url, timeoutMs = 9000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return await response.json()
  } finally {
    clearTimeout(timeout)
  }
}

function buildGdeltTimelineUrl(query, timespan = '1month') {
  const url = new URL(GDELT_ENDPOINT)
  url.searchParams.set('query', query)
  url.searchParams.set('mode', 'TimelineVolRaw')
  url.searchParams.set('format', 'json')
  url.searchParams.set('TIMESPAN', timespan)
  return url.toString()
}

function parseTimelineSignal(payload) {
  const points =
    payload?.timeline?.[0]?.data
      ?.map((point) => ({
        date: point?.date,
        value: Number(point?.value ?? 0),
      }))
      .filter((point) => Number.isFinite(point.value)) ?? []

  if (!points.length) {
    return null
  }

  const latest = points.at(-1)?.value ?? 0
  const baselineWindow = points.slice(-8, -1)
  const fallbackWindow = points.slice(0, -1)
  const baseline = average(
    (baselineWindow.length ? baselineWindow : fallbackWindow).map(
      (point) => point.value,
    ),
  )
  const normalizedBaseline = baseline <= 0 ? 1 : baseline
  const trendPct = ((latest - normalizedBaseline) / normalizedBaseline) * 100
  const volumeScore = clamp(Math.log10(latest + 1) * 24, 0, 70)
  const trendScore = clamp((trendPct + 35) * 0.33, 0, 30)

  return {
    latestArticles: Math.round(latest),
    trendPct: Number(trendPct.toFixed(1)),
    score: Math.round(clamp(volumeScore + trendScore, 8, 98)),
    points: points.slice(-12),
  }
}

async function fetchGdeltSignal(query, timespan = '1month') {
  try {
    const payload = await fetchJson(buildGdeltTimelineUrl(query, timespan))
    return parseTimelineSignal(payload)
  } catch {
    return null
  }
}

function buildEiaUrl(apiKey, facetBuilder) {
  const url = new URL(EIA_ENDPOINT)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('frequency', 'daily')
  url.searchParams.set('data[0]', 'value')
  url.searchParams.set('sort[0][column]', 'period')
  url.searchParams.set('sort[0][direction]', 'desc')
  url.searchParams.set('offset', '0')
  url.searchParams.set('length', '3')
  facetBuilder(url)
  return url.toString()
}

function parseEiaRows(payload) {
  const rows = payload?.response?.data ?? []
  if (!rows.length) {
    return null
  }

  const latest = Number(rows[0]?.value)
  const previous = Number(rows[1]?.value ?? rows[0]?.value)

  if (!Number.isFinite(latest) || !Number.isFinite(previous)) {
    return null
  }

  const changePct = previous === 0 ? 0 : ((latest - previous) / previous) * 100
  const stressScore = clamp(
    Math.round(40 + Math.max(0, latest - 70) * 0.85 + Math.abs(changePct) * 4.2),
    12,
    98,
  )

  return {
    asOf: rows[0]?.period ?? null,
    latestUsd: Number(latest.toFixed(2)),
    changePct: Number(changePct.toFixed(2)),
    score: stressScore,
  }
}

async function fetchBrentSignal() {
  const apiKey = import.meta.env.VITE_EIA_API_KEY || 'DEMO_KEY'
  const urlAttempts = [
    buildEiaUrl(apiKey, (url) => {
      url.searchParams.set('facets[series][]', 'RBRTE')
    }),
    buildEiaUrl(apiKey, (url) => {
      url.searchParams.set('facets[product][]', 'EPCBRENT')
    }),
  ]

  for (const url of urlAttempts) {
    try {
      const payload = await fetchJson(url)
      const parsed = parseEiaRows(payload)

      if (parsed) {
        return parsed
      }
    } catch {
      continue
    }
  }

  return null
}

function buildQuery(actorNames, keywords) {
  const actors = actorNames.map((name) => `"${name}"`).join(' OR ')
  return `(${actors}) AND (${keywords})`
}

function buildSuggestedAdjustments(metrics) {
  const aggregateShock =
    metrics.conflictHeat * 0.28 +
    metrics.oilStress * 0.34 +
    metrics.shippingStress * 0.24 +
    metrics.tradeStress * 0.14
  const suggestedIntensity = clamp(Math.round(44 + aggregateShock * 0.5), 35, 92)
  const focusModeId =
    metrics.oilStress >= metrics.shippingStress + 8
      ? 'energy'
      : metrics.shippingStress >= metrics.oilStress + 8
        ? 'maritime'
        : 'balanced'

  const blockedChokepointIds = unique([
    metrics.oilStress >= 58 ? 'hormuz' : null,
    metrics.shippingStress >= 52 ? 'bab-el-mandeb' : null,
    metrics.shippingStress >= 58 ? 'suez' : null,
    metrics.tradeStress >= 60 ? 'malacca' : null,
  ])

  return {
    intensity: suggestedIntensity,
    focusModeId,
    blockedChokepointIds,
  }
}

function buildSourceHealth(signals) {
  const available = signals.filter(Boolean).length

  if (available >= 5) {
    return 'live'
  }

  if (available >= 3) {
    return 'partial'
  }

  return 'fallback'
}

export async function fetchLiveSignalsSnapshot({
  aggressorName,
  defenderName,
  contextActors = [],
}) {
  const actorNames = unique([aggressorName, defenderName, ...contextActors])
  const [conflictSignal, oilNarrativeSignal, shippingSignal, indiaSignal, tradeSignal] =
    await Promise.all([
      fetchGdeltSignal(
        buildQuery(actorNames, 'war OR conflict OR strike OR missile OR escalation'),
      ),
      fetchGdeltSignal(
        buildQuery(
          actorNames,
          '"oil price" OR crude OR tanker OR refinery OR "Strait of Hormuz"',
        ),
      ),
      fetchGdeltSignal(
        buildQuery(
          actorNames,
          '"shipping route" OR blockade OR detour OR "Red Sea" OR "Suez Canal" OR "Bab el-Mandeb"',
        ),
      ),
      fetchGdeltSignal(
        buildQuery(
          [...actorNames, 'India'],
          '"India" AND (fuel OR imports OR shipping OR trade OR inflation)',
        ),
      ),
      fetchGdeltSignal(
        buildQuery(
          actorNames,
          '"global markets" OR "supply chain" OR "trade flows" OR inflation',
        ),
      ),
    ])

  const brentSignal = await fetchBrentSignal()

  const conflictHeat = conflictSignal?.score ?? 46
  const shippingStress = shippingSignal?.score ?? 44
  const oilStress = clamp(
    Math.round((oilNarrativeSignal?.score ?? 48) * 0.62 + (brentSignal?.score ?? 52) * 0.38),
    12,
    98,
  )
  const indiaExposure = clamp(
    Math.round(
      (indiaSignal?.score ?? 45) * 0.55 +
        shippingStress * 0.18 +
        oilStress * 0.27,
    ),
    10,
    98,
  )
  const tradeStress = clamp(
    Math.round((tradeSignal?.score ?? 43) * 0.64 + shippingStress * 0.36),
    10,
    98,
  )

  const metrics = {
    conflictHeat,
    oilStress,
    shippingStress,
    indiaExposure,
    tradeStress,
  }

  return {
    fetchedAt: new Date().toISOString(),
    sourceHealth: buildSourceHealth([
      conflictSignal,
      oilNarrativeSignal,
      shippingSignal,
      indiaSignal,
      tradeSignal,
      brentSignal,
    ]),
    metrics,
    brentSignal,
    traces: {
      conflict: conflictSignal,
      oilNarrative: oilNarrativeSignal,
      shipping: shippingSignal,
      india: indiaSignal,
      trade: tradeSignal,
    },
    suggestedAdjustments: buildSuggestedAdjustments(metrics),
  }
}
