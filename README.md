# Continuumm

Continuumm is a web-based geopolitical impact simulator that visualizes how war
between two countries can create second-order effects across trade, energy,
shipping routes, and strategic chokepoints.

## Stack

- React
- Vite
- Tailwind CSS
- React Router
- Firebase Hosting (planned deployment target)

## Current Pages

- `/` Home
- `/simulator`
- `/methodology`
- `/documentation`
- `/about`

## Live Data Overlay (Simulator)

The simulator includes an optional live overlay that ingests open-source
signals and applies capped pressure multipliers on top of the structural model.

Current sources:

- GDELT DOC API (conflict, shipping, trade, and India-focused news-volume trends)
- U.S. EIA API (Brent spot reference, with `VITE_EIA_API_KEY`, default `DEMO_KEY`)

If those APIs fail or are blocked, Continuumm automatically falls back to the
seed structural model.

## Local Development

```powershell
npm install
npm run dev
```

## Quality Checks

```powershell
npm run build
npm run lint
npm run test
```

## Firebase

Tracked Firebase foundation files:

- `firebase.json`
- `.firebaserc.example`
- `.env.example`
- `src/lib/firebase.js`

Local setup flow:

1. Copy `.firebaserc.example` to `.firebaserc`
2. The Firebase project ID is `continuumm`
3. Fill `.env` using `.env.example` (`VITE_EIA_API_KEY` is optional)

Both `.firebaserc` and `.env` stay local-only until you decide the official
project binding is ready to be tracked differently.

Hosting commands:

```powershell
npm run firebase:emulators
npm run deploy:hosting
```

## Release Workflow

Use version-style commits with a short summary:

- `vX.Y.Z: concise summary`

Interpretation:

- `X` major milestone or architectural shift
- `Y` minor feature milestone
- `Z` patch, bug fix, or polish

Example:

- `v0.1.0: establish the Continuumm multipage foundation`

Default cadence:

1. Update `src/data/documentationEntries.js`
2. Run build/lint/test as appropriate
3. Commit with the versioned summary format
4. Push to GitHub

## Documentation Workflow

Public-facing project history is tracked in:

- `src/data/documentationEntries.js`

Local-only working memory is tracked in:

- `.continuumm/`

The intended process is:

1. Make a meaningful change.
2. Update `src/data/documentationEntries.js`.
3. Run build/lint/test.
4. Commit with the versioned summary format.
