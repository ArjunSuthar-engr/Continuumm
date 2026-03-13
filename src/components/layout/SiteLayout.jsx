import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/documentation', label: 'Documentation' },
  { to: '/about', label: 'About' },
]

function SiteLayout() {
  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[1600px] flex-col gap-6 rounded-[28px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_30px_120px_rgba(1,8,16,0.45)] backdrop-blur xl:p-6">
        <header className="rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(7,17,26,0.94),rgba(9,28,42,0.78)_55%,rgba(164,112,68,0.18))] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200/20 bg-[linear-gradient(135deg,rgba(210,180,140,0.2),rgba(10,20,30,0.72))] text-xl font-semibold text-amber-100">
                C
              </div>
              <div>
                <p className="eyebrow">Continuumm</p>
                <p className="mt-1 text-sm text-slate-300">
                  Geopolitical spillover simulator
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <NavLink to="/simulator" className="route-cta self-start xl:self-auto">
              Open Simulator
            </NavLink>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,17,26,0.92),rgba(6,19,29,0.78))] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Build posture</p>
              <h2 className="mt-3 text-2xl text-stone-100">
                Structural, visual, and openly documented.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Continuumm is being built as a product website first, then expanded
                into a richer global network simulator. Public-facing progress is
                tracked on the Documentation page, while local build memory lives
                in `.continuumm/`.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className="footer-link"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default SiteLayout
