import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from './themeContext'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/documentation', label: 'Documentation' },
  { to: '/about', label: 'About' },
]

function SiteLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-10">
      <div className="site-shell mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[1600px] flex-col gap-6 p-4 xl:p-6">
        <header className="site-header px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="site-brand-mark">
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

            <div className="flex flex-wrap items-center gap-2 self-start xl:self-auto">
              <button type="button" className="theme-toggle" onClick={toggleTheme}>
                <span className="theme-toggle-label">Theme</span>
                <span className="theme-toggle-value">
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>
              <NavLink to="/simulator" className="route-cta">
                Open Simulator
              </NavLink>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="site-footer px-5 py-5 sm:px-6">
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
