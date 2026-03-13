export const documentationWorkflow = [
  'After every meaningful Git commit, append one new public-facing entry in this file.',
  'Record what changed, why it matters, and what should be reviewed next.',
  'Keep deeper internal notes in `.continuumm/`, but keep user-visible project history here.',
]

export const documentationEntries = [
  {
    id: 'log-010',
    date: '2026-03-13',
    label: 'Live simulator',
    title: 'Added an API-driven live intelligence overlay to the simulator',
    summary:
      'The simulator now supports a live telemetry layer using open-source data feeds, including a US-Israel-Iran escalation preset and capped real-time signal multipliers applied to structural spillover scoring.',
    items: [
      'Added a dedicated live-intel panel with refresh/apply controls, source-health status, and an overlay toggle.',
      'Integrated GDELT trend signals and EIA Brent references into a resilient fetch pipeline with fallback behavior.',
      'Extended the country graph with Israel and added a scenario preset centered on US-Israel-Iran escalation context.',
    ],
    review:
      'Run the simulator preset, refresh live signals, and verify whether the resulting India and third-country pressure shifts feel plausible.',
  },
  {
    id: 'log-009',
    date: '2026-03-13',
    label: 'UI direction',
    title: 'Reframed Continuumm as an operations-theater interface',
    summary:
      'The visual system was rebuilt around a Dunkirk-inspired command-table language with stronger theater hierarchy, dispatch-style briefing blocks, and a less generic dashboard posture across core pages.',
    items: [
      'Redesigned the shared shell and navigation into a command-console structure with status rail signals.',
      'Reworked Home and Simulator hero sections into theater briefing surfaces with dispatch cards and mission strips.',
      'Retuned the global CSS token system, motion cadence, and panel geometry to make the product feel more cinematic and less SaaS-like.',
    ],
    review:
      'Check the Home and Simulator pages in both themes and confirm whether this new direction should be locked as the visual baseline.',
  },
  {
    id: 'log-008',
    date: '2026-03-13',
    label: 'Theme',
    title: 'Added a persistent light theme across the multi-page experience',
    summary:
      'Continuumm now supports both dark and light presentation modes with a shared theme toggle, stored user preference, and tokenized surface styling so the look stays coherent across every page.',
    items: [
      'Added a persistent theme toggle in the shared header and stored the user preference locally.',
      'Reworked core layout, hero surfaces, panels, and simulator map styling around theme-aware design tokens.',
      'Extended the visual system so the lighter presentation still feels maritime and analytical rather than generic.',
    ],
    review:
      'Check both themes on the home page and simulator page, then note which mode feels stronger and where contrast still needs adjustment.',
  },
  {
    id: 'log-007',
    date: '2026-03-13',
    label: 'Release',
    title: 'Prepared the first versioned baseline for GitHub',
    summary:
      'Continuumm is ready for its first official repository checkpoint with a descriptive versioned commit format, a multi-page product shell, Firebase Hosting foundation, and hardened simulator architecture.',
    items: [
      'Locked the first milestone as `v0.1.0` and adopted the commit style `vX.Y.Z: concise summary` for clearer GitHub history.',
      'Carried the project from repo setup through the first multi-page website structure and public documentation system.',
      'Finished the initial architecture pass with Firebase Hosting scaffolding, feature-based simulator organization, lazy routes, and automated simulator verification.',
    ],
    review:
      'After the push, review the GitHub repository history and confirm the next priority page or simulator improvement.',
  },
  {
    id: 'log-006',
    date: '2026-03-13',
    label: 'Scale readiness',
    title: 'Hardened the architecture before the first versioned release',
    summary:
      'The simulator is now grouped under a dedicated feature boundary, routes are lazy-loaded, and the model has an automated regression check before the first `v0.1.0` commit.',
    items: [
      'Moved simulator state, data, logic, and UI into `src/features/simulator`.',
      'Added route-level lazy loading with a shared loading fallback.',
      'Added an automated simulator verification script and wired `npm run test` into the project workflow.',
    ],
    review:
      'Check whether the current structure feels stable enough for the first versioned commit and push.',
  },
  {
    id: 'log-005',
    date: '2026-03-13',
    label: 'Firebase',
    title: 'Added Firebase Hosting and runtime scaffolding',
    summary:
      'Continuumm now has Firebase Hosting configuration, React Router rewrites, deploy scripts, and env-based Firebase app initialization, with `continuumm` confirmed as the official Firebase project ID.',
    items: [
      'Added `firebase.json` with Hosting rewrites for the routed React app.',
      'Added `deploy:hosting` and emulator scripts plus a tracked `.env.example`.',
      'Prepared runtime Firebase initialization while leaving the real project ID and keys to local configuration.',
    ],
    review:
      'Check whether Hosting-only Firebase is enough for now or if Firestore/Auth should also be wired next.',
  },
  {
    id: 'log-004',
    date: '2026-03-13',
    label: 'Workflow',
    title: 'Adopted a versioned commit and release process',
    summary:
      'Continuumm now has an explicit release workflow: meaningful changes update the public documentation log, use version-style commit messages, and push to GitHub after commit.',
    items: [
      'Standardized commit messages in the form `vX.Y.Z: concise summary`.',
      'Defined the Documentation page as the public-facing project history after each meaningful milestone.',
      'Kept Firebase Hosting as the planned deployment target for the website.',
    ],
    review:
      'Confirm whether this release cadence should apply to every meaningful milestone or only externally visible ones.',
  },
  {
    id: 'log-003',
    date: '2026-03-13',
    label: 'Architecture',
    title: 'Restructuring Continuumm into a multi-page website',
    summary:
      'Introduced routed page boundaries so the simulator, methodology, documentation, and project story can evolve independently.',
    items: [
      'Added React Router and page-level navigation.',
      'Split the app into Home, Simulator, Methodology, Documentation, and About pages.',
      'Defined this public project-log system so each commit can be reflected on the site.',
    ],
    review: 'Check whether the page structure now feels like a real product website.',
  },
  {
    id: 'log-002',
    date: '2026-03-13',
    label: 'Prototype',
    title: 'First Continuumm simulator shell',
    summary:
      'Replaced the default Vite starter with the first themed simulator interface and a seeded structural impact model.',
    items: [
      'Built the initial conflict controls, ripple board, and impact ranking panels.',
      'Added a curated country network, chokepoints, and spillover scoring.',
      'Established the first Dunkirk-inspired interface direction.',
    ],
    review: 'Review the seriousness of the design direction and the simulator layout.',
  },
  {
    id: 'log-001',
    date: '2026-03-13',
    label: 'Foundation',
    title: 'Project and repo setup',
    summary:
      'Configured the repository to use Arjun’s Git identity and isolated the project from the second GitHub account on the laptop.',
    items: [
      'Verified the SSH alias for the Arjun GitHub account.',
      'Configured repo-local Git name and email.',
      'Connected the official GitHub remote for Continuumm.',
    ],
    review: 'No UI review was required for this milestone.',
  },
]
