import { firebaseConfigured } from '../lib/firebase'
import { roadmapStages } from '../data/projectContent'

const stack = [
  'React for the UI system and route structure',
  'Vite for development speed and production builds',
  'Tailwind CSS for a controlled visual language',
  'Firebase Hosting configuration for deployment and future backend integration',
]

function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="hero-shell hero-dossier px-5 py-8 sm:px-6 lg:px-8">
        <p className="eyebrow">About</p>
        <h1 className="mt-4 max-w-4xl text-5xl leading-none text-stone-100 sm:text-6xl">
          Continuumm is being built as a serious geopolitical product, not just a
          demo page.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          The project exists to help people see how distant countries can still be
          structurally exposed when conflict snaps trade links, tightens energy
          supply, and clogs maritime chokepoints.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Mission</p>
              <h2 className="panel-title">What this product should feel like</h2>
            </div>
            <p className="panel-copy">
              The interface should feel deliberate, cinematic, and analytical,
              while the simulator remains explainable and product-shaped.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="story-card">
              <p className="eyebrow">Mood</p>
              <h3 className="mt-3 text-2xl text-stone-100">
                Maritime, austere, atmospheric
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The Dunkirk inspiration should read through pacing, palette, tension,
                and structure rather than direct imitation.
              </p>
            </article>
            <article className="story-card">
              <p className="eyebrow">Output quality</p>
              <h3 className="mt-3 text-2xl text-stone-100">
                Explainable over magical
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Users should see why a result appears, not just a stylish number.
              </p>
            </article>
            <article className="story-card md:col-span-2">
              <p className="eyebrow">Delivery</p>
              <h3 className="mt-3 text-2xl text-stone-100">
                Modular pages so each part can be improved in isolation
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The routing split keeps simulator logic, design work, methodology,
                and changelog writing from competing inside a single file.
              </p>
            </article>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Stack</p>
              <h2 className="panel-title">Current implementation choices</h2>
            </div>
            <p className="panel-copy">
              The toolchain is chosen to keep iteration fast without making a
              complex simulator painful to maintain.
            </p>
          </div>

          <div className="space-y-3">
            {stack.map((item) => (
              <article key={item} className="story-card">
                <p className="text-sm leading-7 text-slate-300">{item}</p>
              </article>
            ))}
            <article className="story-card">
              <p className="eyebrow">Firebase runtime</p>
              <h3 className="mt-3 text-2xl text-stone-100">
                {firebaseConfigured ? 'Locally configured' : 'Awaiting project keys'}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                The repo now includes Hosting and runtime scaffolding, but the real
                Firebase project binding remains local until the project ID and web
                app credentials are filled in.
              </p>
            </article>
          </div>
        </section>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Roadmap</p>
            <h2 className="panel-title">How the build is staged</h2>
          </div>
          <p className="panel-copy">
            The route architecture is finished early so future work can target the
            product one layer at a time.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {roadmapStages.map((stage) => (
            <article key={stage.id} className="story-card">
              <p className="eyebrow">{stage.status}</p>
              <h3 className="mt-3 text-2xl text-stone-100">{stage.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {stage.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPage
