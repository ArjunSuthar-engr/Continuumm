import { documentationEntries, documentationWorkflow } from '../data/documentationEntries'
import {
  firebaseFoundationItems,
  firebaseSetupSteps,
} from '../data/projectContent'
import { firebaseConfigured, firebaseProjectId } from '../lib/firebase'

function DocumentationPage() {
  return (
    <div className="space-y-6">
      <section className="hero-shell hero-dossier px-5 py-8 sm:px-6 lg:px-8">
        <p className="eyebrow">Documentation</p>
        <h1 className="mt-4 max-w-4xl text-5xl leading-none text-stone-100 sm:text-6xl">
          A public build log for every meaningful step in the project.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          This page is the user-visible project memory. It records the shipped
          changes, what they were meant to achieve, and what should be reviewed
          next after each milestone.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Update rule</p>
              <h2 className="panel-title">How this page should be maintained</h2>
            </div>
            <p className="panel-copy">
              The goal is to avoid losing context between iterations or forcing the
              user to restate the project state from scratch.
            </p>
          </div>

          <div className="space-y-3">
            {documentationWorkflow.map((item, index) => (
              <article key={item} className="story-card">
                <p className="eyebrow">Step 0{index + 1}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Source files</p>
              <h2 className="panel-title">Public and private memory split</h2>
            </div>
            <p className="panel-copy">
              The website keeps public progress visible, while deeper working notes
              remain local-only.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="story-card">
              <p className="eyebrow">Public page source</p>
              <h3 className="mt-3 text-2xl text-stone-100">
                `src/data/documentationEntries.js`
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Add one visible summary entry here after each meaningful commit so
                the site reflects its own build history.
              </p>
            </article>
            <article className="story-card">
              <p className="eyebrow">Local-only notes</p>
              <h3 className="mt-3 text-2xl text-stone-100">`.continuumm/`</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Keep detailed work logs, roadmap state, and review notes here
                without exposing them to the public repo.
              </p>
            </article>
            <article className="story-card md:col-span-2">
              <p className="eyebrow">Review loop</p>
              <h3 className="mt-3 text-2xl text-stone-100">
                Build, ask for review, record the decision, move forward
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                This page is meant to keep the user-facing milestone trail clean,
                while the private review log preserves the exact checkpoint-to-reply
                chain.
              </p>
            </article>
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Firebase status</p>
              <h2 className="panel-title">Deployment foundation is in the repo</h2>
            </div>
            <p className="panel-copy">
              Hosting configuration is tracked, but the real Firebase project
              binding and web-app keys remain local until you provide them.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="story-card">
              <p className="eyebrow">Hosting config</p>
              <h3 className="mt-3 text-2xl text-stone-100">Ready</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                `firebase.json` is present with SPA rewrites for React Router and
                cache headers for built assets.
              </p>
            </article>
            <article className="story-card">
              <p className="eyebrow">Runtime env</p>
              <h3 className="mt-3 text-2xl text-stone-100">
                {firebaseConfigured ? 'Configured locally' : 'Pending local config'}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {firebaseProjectId
                  ? `Current local project ID: ${firebaseProjectId}`
                  : 'No Firebase web app keys are loaded in the local env yet.'}
              </p>
            </article>
          </div>

          <div className="mt-4 space-y-3">
            {firebaseFoundationItems.map((item) => (
              <article key={item} className="story-card">
                <p className="text-sm leading-7 text-slate-300">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">What remains</p>
              <h2 className="panel-title">Project binding checklist</h2>
            </div>
            <p className="panel-copy">
              These are the final setup steps once the Firebase project is chosen.
            </p>
          </div>

          <div className="space-y-3">
            {firebaseSetupSteps.map((item, index) => (
              <article key={item} className="story-card">
                <p className="eyebrow">Step 0{index + 1}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Timeline</p>
            <h2 className="panel-title">Recorded milestones</h2>
          </div>
          <p className="panel-copy">
            These entries are ordered newest-first and should be extended whenever a
            commit materially changes the product.
          </p>
        </div>

        <div className="space-y-4">
          {documentationEntries.map((entry) => (
            <article key={entry.id} className="timeline-card">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="timeline-chip">{entry.date}</span>
                    <span className="timeline-chip">{entry.label}</span>
                  </div>
                  <h3 className="mt-4 text-3xl text-stone-100">{entry.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {entry.summary}
                  </p>
                </div>
                <div className="notice-card max-w-sm px-4 py-4">
                  <p className="eyebrow">Next review</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {entry.review}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {entry.items.map((item) => (
                  <article key={item} className="story-card">
                    <p className="text-sm leading-7 text-slate-300">{item}</p>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DocumentationPage
