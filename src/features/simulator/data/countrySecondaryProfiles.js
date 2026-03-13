import { countriesById } from './network.js'

export const countrySecondarySnapshot = {
  asOf: '2026-03-14',
  summary:
    'Country-level secondary-effect sensitivities blend observed indicators and explicit model fallbacks.',
  sources: [
    {
      id: 'ember-electricity-mix',
      label: 'Ember Electricity Data Explorer (fuel mix shares)',
      url: 'https://ember-energy.org/data/data-tools/data-explorer/',
    },
    {
      id: 'world-bank-wdi',
      label: 'World Bank WDI macro sensitivity proxies',
      url: 'https://data.worldbank.org/indicator',
    },
    {
      id: 'unctad-shipping',
      label: 'UNCTAD shipping-cost pass-through analyses',
      url: 'https://unctad.org/topic/transport-and-trade-logistics',
    },
  ],
}

const secondaryProfiles = {
  india: {
    fuelPassThrough: {
      value: 0.78,
      basis: 'observed-inferred',
      source: 'RBI inflation decomposition and OMC pricing behavior (proxy blend).',
    },
    freightPassThrough: {
      value: 0.66,
      basis: 'observed-inferred',
      source: 'UNCTAD shipping pass-through evidence mapped to India import structure.',
    },
    inflationSensitivity: {
      value: 0.34,
      basis: 'observed-inferred',
      source: 'World Bank CPI structure proxy with India energy-food exposure.',
    },
    manufacturingSensitivity: {
      value: 0.64,
      basis: 'modelled',
      source:
        'Continuumm model fallback using trade and manufacturing concentration.',
    },
    gasPowerSharePct: {
      value: 4,
      basis: 'observed',
      source: 'Ember power mix snapshot: gas generation share in low single digits.',
    },
    electricityPassThrough: {
      value: 0.26,
      basis: 'observed-inferred',
      source: 'Tariff-fuel adjustment prevalence and gas-based generation weight.',
    },
  },
  china: {
    fuelPassThrough: {
      value: 0.62,
      basis: 'observed-inferred',
      source: 'Refined-product pricing controls reduce direct passthrough.',
    },
    freightPassThrough: {
      value: 0.57,
      basis: 'observed-inferred',
      source: 'Export-heavy manufacturing and maritime logistics dependence.',
    },
    inflationSensitivity: {
      value: 0.28,
      basis: 'observed-inferred',
      source: 'CPI basket and administered-price dampening proxy.',
    },
    manufacturingSensitivity: {
      value: 0.78,
      basis: 'observed-inferred',
      source: 'Industrial concentration and high shipping throughput sensitivity.',
    },
    gasPowerSharePct: {
      value: 3,
      basis: 'observed',
      source: 'Ember fuel mix: gas share remains low in total generation.',
    },
    electricityPassThrough: {
      value: 0.18,
      basis: 'modelled',
      source: 'Continuumm fallback for regulated tariff systems.',
    },
  },
  japan: {
    fuelPassThrough: {
      value: 0.74,
      basis: 'observed-inferred',
      source: 'Import-dependent refined-fuel market passthrough behavior.',
    },
    freightPassThrough: {
      value: 0.61,
      basis: 'observed-inferred',
      source: 'Seaborne import reliance and shipping-cost transmission.',
    },
    inflationSensitivity: {
      value: 0.27,
      basis: 'observed-inferred',
      source: 'Macro proxy from CPI structure and currency import channel.',
    },
    manufacturingSensitivity: {
      value: 0.7,
      basis: 'observed-inferred',
      source: 'High-value manufacturing timing and just-in-time logistics sensitivity.',
    },
    gasPowerSharePct: {
      value: 34,
      basis: 'observed',
      source: 'Ember fuel mix: gas remains a large share of power generation.',
    },
    electricityPassThrough: {
      value: 0.54,
      basis: 'observed-inferred',
      source: 'LNG-linked generation cost transmission into power tariffs.',
    },
  },
  'south-korea': {
    fuelPassThrough: {
      value: 0.71,
      basis: 'observed-inferred',
      source: 'Import fuel dependency and refinery market behavior.',
    },
    freightPassThrough: {
      value: 0.63,
      basis: 'observed-inferred',
      source: 'Trade-heavy maritime model and container cost pass-through.',
    },
    inflationSensitivity: {
      value: 0.29,
      basis: 'observed-inferred',
      source: 'Macro sensitivity proxy from CPI and import intensity.',
    },
    manufacturingSensitivity: {
      value: 0.75,
      basis: 'observed-inferred',
      source: 'Semiconductor and export logistics concentration sensitivity.',
    },
    gasPowerSharePct: {
      value: 29,
      basis: 'observed',
      source: 'Ember fuel mix proxy with significant gas-fired generation share.',
    },
    electricityPassThrough: {
      value: 0.48,
      basis: 'observed-inferred',
      source: 'Generation-fuel pass-through patterns in utility pricing.',
    },
  },
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function fallbackProfile(countryId) {
  const country = countriesById[countryId]
  const shippingSensitivity = (country?.shippingSensitivity ?? 40) / 100

  return {
    fuelPassThrough: {
      value: clamp(0.56 + shippingSensitivity * 0.14, 0.5, 0.78),
      basis: 'modelled',
      source: 'Continuumm fallback model from shipping and energy exposure.',
    },
    freightPassThrough: {
      value: clamp(0.52 + shippingSensitivity * 0.2, 0.48, 0.82),
      basis: 'modelled',
      source: 'Continuumm fallback model from maritime sensitivity.',
    },
    inflationSensitivity: {
      value: clamp(0.22 + shippingSensitivity * 0.14, 0.2, 0.42),
      basis: 'modelled',
      source: 'Continuumm fallback macro sensitivity model.',
    },
    manufacturingSensitivity: {
      value: clamp(0.55 + shippingSensitivity * 0.2, 0.48, 0.86),
      basis: 'modelled',
      source: 'Continuumm fallback production/logistics model.',
    },
    gasPowerSharePct: {
      value: clamp(Math.round(8 + shippingSensitivity * 20), 6, 28),
      basis: 'modelled',
      source: 'Continuumm fallback gas-share estimate.',
    },
    electricityPassThrough: {
      value: clamp(0.24 + shippingSensitivity * 0.16, 0.2, 0.52),
      basis: 'modelled',
      source: 'Continuumm fallback electricity fuel pass-through model.',
    },
  }
}

export function getCountrySecondaryProfile(countryId) {
  return secondaryProfiles[countryId] ?? fallbackProfile(countryId)
}
