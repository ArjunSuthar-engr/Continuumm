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

const menuItems = [
  {
    to: '/',
    label: 'Home',
    code: '01',
    note: 'Mission brief and platform posture',
  },
  {
    to: '/methodology',
    label: 'Methodology',
    code: '02',
    note: 'How spillover pressure is modeled',
  },
  {
    to: '/about',
    label: 'About',
    code: '03',
    note: 'Intent, scope, and non-goals',
  },
]

function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const { theme, toggleTheme } = useTheme()
  const lastScrollY = useRef(0)
  const menuOpenRef = useRef(false)
  const menuRailRef = useRef(null)
  const menuButtonRef = useRef(null)

  useEffect(() => {
    menuOpenRef.current = menuOpen
  }, [menuOpen])

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      const previousScrollY = lastScrollY.current

      if (menuOpenRef.current) {
        setHeaderVisible(true)
        lastScrollY.current = currentScrollY
        return
      }

      if (currentScrollY <= 12) {
        setHeaderVisible(true)
      } else if (currentScrollY > previousScrollY + 6) {
        setHeaderVisible(false)
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

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    function handleOutsidePointer(event) {
      const target = event.target

      if (
        menuRailRef.current?.contains(target) ||
        menuButtonRef.current?.contains(target)
      ) {
        return
      }

      setMenuOpen(false)
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointer)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen])

  function handleLinkClick() {
    setMenuOpen(false)
  }

  function handleMenuToggle() {
    setHeaderVisible(true)
    setMenuOpen((current) => !current)
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
            <div className="menu-rail-shell">
              <nav
                id="header-command-menu"
                ref={menuRailRef}
                className={`menu-rail ${menuOpen ? 'menu-rail-open' : ''}`}
                aria-label="Main navigation"
              >
                {menuItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `menu-rail-link ${isActive ? 'menu-rail-link-active' : ''}`
                    }
                    onClick={handleLinkClick}
                  >
                    <span className="menu-rail-link-code">{item.code}</span>
                    <span className="menu-rail-link-label">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <button
                ref={menuButtonRef}
                type="button"
                className="icon-button"
                aria-label="Menu"
                title="Menu"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-controls="header-command-menu"
                onClick={handleMenuToggle}
              >
                <svg viewBox="0 0 24 24" className="icon-svg" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {menuOpen ? (
          <nav className="nav-drawer nav-drawer-mobile" aria-label="Main navigation">
            <p className="nav-drawer-label">Command menu</p>
            <div className="nav-drawer-grid">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `drawer-link ${isActive ? 'drawer-link-active' : ''}`
                  }
                  onClick={handleLinkClick}
                >
                  <span className="drawer-link-code">{item.code}</span>
                  <span className="drawer-link-copy">
                    <span className="drawer-link-title">{item.label}</span>
                    <span className="drawer-link-note">{item.note}</span>
                  </span>
                  <span className="drawer-link-arrow" aria-hidden="true">
                    {'->'}
                  </span>
                </NavLink>
              ))}
            </div>
          </nav>
        ) : null}
      </header>

      <div className="site-shell mx-auto w-full max-w-[1680px] px-4 pb-4 pt-6 sm:px-5 sm:pt-7 lg:px-6 lg:pt-8">

        <main className="site-main">
          <Outlet />
        </main>

        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-copy-block">
              <p className="footer-copy">
                Continuumm maps structural spillover across trade, energy, and
                strategic chokepoints.
              </p>
              <p className="footer-disclaimer">
                Model outputs blend observed, inferred, and modelled inputs and
                are not fully synced in real time. Verify with primary sources
                before making decisions.
              </p>
            </div>
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
