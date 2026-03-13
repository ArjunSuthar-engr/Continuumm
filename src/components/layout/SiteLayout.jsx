import { useEffect, useRef, useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const { theme, toggleTheme } = useTheme()
  const lastScrollY = useRef(0)

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      const previousScrollY = lastScrollY.current

      if (currentScrollY <= 12) {
        setHeaderVisible(true)
      } else if (currentScrollY > previousScrollY + 6) {
        setHeaderVisible(false)
        setMenuOpen(false)
      } else if (currentScrollY < previousScrollY - 6) {
        setHeaderVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function handleLinkClick() {
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen">
      <header
        className={`top-nav ${headerVisible ? 'top-nav-visible' : 'top-nav-hidden'}`}
      >
        <div className="top-nav-inner">
          <NavLink to="/" className="brand-cluster" onClick={handleLinkClick}>
            <span className="site-brand-mark">
              <img
                src="/logo.svg"
                alt="Continuumm logo"
                className="site-brand-logo"
              />
            </span>
            <span className="brand-word">Continuumm</span>
          </NavLink>

          <div className="top-nav-right">
            <NavLink
              to="/simulator"
              className="header-cta"
              onClick={handleLinkClick}
            >
              Simulation
            </NavLink>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              <span className="theme-toggle-value">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="Menu"
              title="Menu"
              onClick={() => setMenuOpen((current) => !current)}
            >
              <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav className="nav-drawer" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `drawer-link ${isActive ? 'drawer-link-active' : ''}`
                }
                onClick={handleLinkClick}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </header>

      <div className="site-shell mx-auto w-full max-w-[1680px] px-4 pb-4 pt-6 sm:px-5 sm:pt-7 lg:px-6 lg:pt-8">

        <main className="site-main">
          <Outlet />
        </main>

        <footer className="site-footer">
          <div className="footer-grid">
            <p className="footer-copy">
              Continuumm maps structural spillover across trade, energy, and
              strategic chokepoints.
            </p>
            <div className="footer-nav">
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
