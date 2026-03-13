export const channelDescriptions = {
  energy:
    'Fuel, LNG, and refining exposure jump when exporters or Gulf routes are stressed.',
  shipping:
    'Detours, insurance premiums, and port congestion intensify as sea lanes close.',
  strategic:
    'Alliance commitments and regional balancing force states to re-price risk.',
  trade:
    'Supply chains absorb sanctions, missing components, and rerouted container traffic.',
}

export const methodologySteps = [
  {
    id: 'pair',
    title: 'Select the belligerents',
    description:
      'The user defines the conflict pair, analytical lens, and disruption intensity. The model treats those two countries as the source shock.',
  },
  {
    id: 'routes',
    title: 'Constrain chokepoints',
    description:
      'Closed straits and canals amplify maritime stress, reroute shipping, and increase energy transmission risk for exposed importers.',
  },
  {
    id: 'channels',
    title: 'Score transmission channels',
    description:
      'Trade, energy, shipping, and strategic alignment are scored separately, then weighted by the chosen analytical focus.',
  },
  {
    id: 'ranking',
    title: 'Rank downstream impact',
    description:
      'Third countries are sorted by aggregate structural stress to reveal who absorbs the largest secondary shock.',
  },
]

export const methodologyPrinciples = [
  'Continuumm visualizes structural vulnerability, not deterministic future prediction.',
  'Every score should be explainable through observable links such as trade, fuel dependence, route exposure, or strategic ties.',
  'The simulator is intentionally comparative: it helps users see relative risk and propagation, not precise market prices.',
]

export const limitations = [
  'The current prototype uses a curated seed network rather than full global coverage.',
  'Country scores are simplified structural indicators, not intelligence estimates.',
  'Domestic politics, battlefield dynamics, and time-varying diplomacy are not yet modeled.',
]

export const roadmapStages = [
  {
    id: 'stage-1',
    title: 'Experience foundation',
    status: 'Current',
    description:
      'Multi-page architecture, simulator shell, and a coherent Continuumm visual system.',
  },
  {
    id: 'stage-2',
    title: 'Network expansion',
    status: 'Next',
    description:
      'Broader country coverage, richer chokepoints, and a clearer route overlay layer.',
  },
  {
    id: 'stage-3',
    title: 'Model refinement',
    status: 'Planned',
    description:
      'More defensible scoring logic, explanation traces, and better sensitivity controls.',
  },
  {
    id: 'stage-4',
    title: 'Delivery pipeline',
    status: 'Planned',
    description:
      'Firebase-backed deployment, route rewrites, public deployment, and release workflow polish.',
  },
]

export const siteSections = [
  {
    id: 'simulator',
    to: '/simulator',
    label: 'Simulator',
    title: 'Run conflict scenarios',
    description:
      'Pick two countries in conflict, close chokepoints, and inspect the spillover ranking.',
  },
  {
    id: 'methodology',
    to: '/methodology',
    label: 'Methodology',
    title: 'Explain the model',
    description:
      'Show users what the score means, what it does not mean, and how the channels are combined.',
  },
  {
    id: 'documentation',
    to: '/documentation',
    label: 'Documentation',
    title: 'Track shipped changes',
    description:
      'Maintain a public build log so design and implementation progress remains visible after each commit.',
  },
]

export const firebaseSetupSteps = [
  'Create or choose the Firebase project in the Firebase console.',
  'Copy `.firebaserc.example` to `.firebaserc`. The official Firebase project ID for this repo is `continuumm`.',
  'Fill `.env` from `.env.example` with the Firebase web app configuration values.',
  'Run `npm run build` and `npm run deploy:hosting` when the project is ready to publish.',
]

export const firebaseFoundationItems = [
  'Hosting is configured to serve `dist/` and rewrite all routes to `index.html` for React Router.',
  'Static asset caching headers are defined in `firebase.json`.',
  'Firebase web SDK initialization is isolated behind Vite environment variables.',
  'The official Firebase project ID is `continuumm`, but web app config values still remain local-only.',
]
