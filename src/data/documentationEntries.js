export const documentationWorkflow = [
  'After every meaningful Git commit, append one new public-facing entry in this file.',
  'Record what changed, why it matters, and what should be reviewed next.',
  'Keep deeper internal notes in `.continuumm/`, but keep user-visible project history here.',
]

export const documentationEntries = [
  {
    id: 'log-024',
    date: '2026-03-14',
    label: 'Menu redesign',
    title: 'Rebuilt hamburger menu into a command panel and removed Simulator/Documentation entries',
    summary:
      'The hamburger interaction now opens a styled command-panel grid and intentionally excludes Simulator and Documentation, leaving those routes to their dedicated primary access points.',
    items: [
      'Removed Simulator and Documentation from the hamburger menu items.',
      'Converted plain stacked menu links into structured command cards with code, title, note, and directional cue.',
      'Added responsive behavior so the command cards flow to one column on smaller screens.',
    ],
    review:
      'Check hamburger menu feel, readability, and spacing on desktop/mobile, and confirm only Home, Methodology, and About appear.',
  },
  {
    id: 'log-023',
    date: '2026-03-14',
    label: 'Header controls',
    title: 'Normalized header action sizing and simplified theme toggle label',
    summary:
      'The Simulation button, dark/light toggle, and menu button now use a tighter unified action scale, and the theme toggle displays only Dark/Light text without the extra Theme label.',
    items: [
      'Removed the Theme prefix text from the toggle so only Dark or Light is shown.',
      'Aligned action heights, type scale, spacing, and widths for Simulation, theme toggle, and menu controls.',
      'Adjusted responsive sizing so header action alignment remains consistent on smaller screens.',
    ],
    review:
      'Check header action alignment in desktop/mobile and confirm the toggle now reads only Dark/Light.',
  },
  {
    id: 'log-022',
    date: '2026-03-14',
    label: 'Header motion',
    title: 'Restored scroll hide/reveal while keeping integrated top-rail styling',
    summary:
      'The header once again slides up on downward scroll and returns on upward scroll, while preserving the flat no-shadow/no-blur visual treatment.',
    items: [
      'Reintroduced scroll-direction header visibility logic in the shared layout.',
      'Restored top-nav visible/hidden transform classes for smooth motion.',
      'Kept full-width flush-top sticky behavior and retained non-floating visual styling.',
    ],
    review:
      'Verify the header hides when scrolling down, reappears when scrolling up, and still feels integrated at the top.',
  },
  {
    id: 'log-021',
    date: '2026-03-14',
    label: 'Header integration',
    title: 'Removed floating header feel and made sticky header persistent',
    summary:
      'The top rail now stays visible while scrolling and no longer uses shadow/blur effects that made it look detached from the page surface.',
    items: [
      'Removed scroll-direction hide/show behavior so the header remains present throughout page scroll.',
      'Removed top-bar shadow and blur treatment to eliminate the hovering look.',
      'Kept the header full-width, flush at top, and sticky for continuous navigation access.',
    ],
    review:
      'Confirm the header now feels integrated with page content at the top and remains visible while scrolling.',
  },
  {
    id: 'log-020',
    date: '2026-03-14',
    label: 'Header width',
    title: 'Made the top header full-bleed and flush with the top edge',
    summary:
      'The command header now spans the full viewport width, touches the top edge, and keeps the existing hide-on-scroll-down/show-on-scroll-up behavior.',
    items: [
      'Moved the shared header outside the centered max-width shell so it can stretch edge-to-edge.',
      'Set sticky top offset to 0 so the header sits flush against the top of the viewport.',
      'Kept content alignment by constraining only header inner content and menu drawer to the main max-width grid.',
    ],
    review:
      'Check that the header now reads full-width at the top on all pages while preserving smooth scroll-hide and return behavior.',
  },
  {
    id: 'log-019',
    date: '2026-03-14',
    label: 'Header behavior',
    title: 'Fixed simulator dark-mode surfaces and added scroll-aware sticky header behavior',
    summary:
      'Dark mode rendering on the Simulator was corrected by moving key cards back to theme-driven panel tokens, and the header now stays sticky while auto-hiding on downward scroll and returning on upward scroll.',
    items: [
      'Replaced hardcoded white panel surfaces with theme token backgrounds/borders for dark-mode consistency.',
      'Implemented scroll-direction logic in the shared layout to hide header on scroll down and reveal it on scroll up.',
      'Kept theme toggle in the top bar while preserving menu behavior during header transitions.',
    ],
    review:
      'Verify simulator readability in dark mode and confirm the header now feels sticky yet unobtrusive while scrolling.',
  },
  {
    id: 'log-018',
    date: '2026-03-14',
    label: 'Header correction',
    title: 'Converted header to a non-floating command rail and restored theme toggle',
    summary:
      'The top bar now sits as a static header section (not floating) and includes a working dark/light toggle while preserving Simulation and Menu actions.',
    items: [
      'Removed sticky/floating behavior from the top navigation so it stays anchored in page flow.',
      'Reintroduced theme toggle controls in the right action group.',
      'Retuned header and landing section colors to respect dark/light theme tokens.',
    ],
    review:
      'Check that the header no longer feels floating and verify dark/light mode readability on Home and Simulator.',
  },
  {
    id: 'log-017',
    date: '2026-03-14',
    label: 'Header refinement',
    title: 'Simplified top-bar actions and enlarged the orb logo',
    summary:
      'The top navigation now keeps only two right-side actions (Simulation and Menu), while the logo was cleaned by removing the outer ring and increasing its visual prominence.',
    items: [
      'Removed the extra right-side icon action so the header now uses only two buttons.',
      'Increased header logo size for stronger brand presence in the top bar.',
      'Removed the outer circular ring from `public/logo.svg` for a cleaner orb mark.',
    ],
    review:
      'Confirm that logo scale and top-bar action density now match your expected visual hierarchy.',
  },
  {
    id: 'log-016',
    date: '2026-03-14',
    label: 'Layout overhaul',
    title: 'Rebuilt header and page structure around a cleaner enterprise layout',
    summary:
      'The global header was redesigned into a floating action bar with compact brand, direct CTA, icon controls, and collapsible navigation, while Home and Simulator were restructured to match a cleaner large-type product posture.',
    items: [
      'Replaced the old multi-pill nav header with a left-brand/right-action top bar and slide-down navigation drawer.',
      'Reworked Home into a large hero statement plus software rows and baseline readout sections.',
      'Retuned global surfaces, spacing, and typography for a brighter, cleaner full-page structure across routes.',
    ],
    review:
      'Compare header proportions, hero hierarchy, and section rhythm against your target reference and identify what still feels off.',
  },
  {
    id: 'log-015',
    date: '2026-03-14',
    label: 'Website redesign',
    title: 'Shifted the site to a high-contrast product-platform visual system',
    summary:
      'The shared shell and homepage were redesigned to a sharper enterprise-style interface with stronger typography hierarchy, cleaner navigation posture, and clearer proof-driven content structure.',
    items: [
      'Refactored the global header and footer into a tighter product-shell layout with compact brand treatment.',
      'Rebuilt the Home page around a bold hero, operational proof card, KPI strip, and cleaner capability/story sections.',
      'Retuned global design tokens and reusable surfaces so all routed pages inherit the new visual language.',
    ],
    review:
      'Check desktop and mobile hierarchy on Home, then verify Simulator/Methodology/Documentation/About still feel coherent under the new system.',
  },
  {
    id: 'log-014',
    date: '2026-03-14',
    label: 'Logo iteration',
    title: 'Simplified branding to an orb-only logo',
    summary:
      'The header brand was simplified again by removing the CONTINUUMM text from the logo and keeping only the backgroundless cinematic orb symbol.',
    items: [
      'Rebuilt `public/logo.svg` as a square orb-only mark with no text or background.',
      'Kept header branding pointed to `/logo.svg`, now rendered as a compact circle icon.',
      'Retained `public/favicon.svg` as the matching orb-style tab icon.',
    ],
    review:
      'Check whether the orb size feels balanced in the header across desktop/mobile and confirm favicon consistency.',
  },
  {
    id: 'log-013',
    date: '2026-03-14',
    label: 'Brand refresh',
    title: 'Redesigned the Continuumm logo to a subtler maritime operations mark',
    summary:
      'The favicon and shared header logo were redesigned with a restrained naval/command-table visual language for a more cinematic and less literal brand presence.',
    items: [
      'Rebuilt `public/favicon.svg` with a quieter steel-and-ember palette and a minimal tactical mark composition.',
      'Kept the favicon file as the single logo source so browser tab icon and in-page brand icon remain synchronized.',
      'Tuned header logo treatment to a subtler shadow so the mark sits naturally in both themes.',
    ],
    review:
      'Check the logo in browser tab and header across pages; confirm if scale and mood now feel aligned with the Dunkirk-inspired direction.',
  },
  {
    id: 'log-012',
    date: '2026-03-14',
    label: 'Branding',
    title: 'Replaced the placeholder C mark with the real Continuumm favicon logo',
    summary:
      'The shared page header now uses the actual favicon SVG as the visible brand logo across the site, replacing the temporary text-based C badge.',
    items: [
      'Updated the global layout brand block to render `/favicon.svg` directly.',
      'Adjusted brand-mark styling for clean logo containment and consistency in both themes.',
      'Kept the same shared header structure so the logo appears on all routed pages automatically.',
    ],
    review:
      'Check the header logo on Home, Simulator, and Documentation in both dark and light themes for scale and clarity.',
  },
  {
    id: 'log-011',
    date: '2026-03-14',
    label: 'Simulator redesign',
    title: 'Simplified simulator into a strict three-pane workflow',
    summary:
      'The simulator was rebuilt around a clear left-middle-right structure: war selection on the left, an interactive world effects map in the center, and single-country impact analysis on the right.',
    items: [
      'Added auto-derived red chokepoint highlighting from the selected war pair, including explicit US-Iran full chokepoint escalation behavior.',
      'Replaced the abstract map board with an interactive Leaflet world map (pan/zoom/click) and chokepoint effect drill-down.',
      'Added a dedicated right-side country analysis panel with direct country selection and impact/chokepoint reasoning.',
    ],
    review:
      'Test if the page now feels intuitive as three clear surfaces and verify that clicking red chokepoints explains downstream country effects clearly.',
  },
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
