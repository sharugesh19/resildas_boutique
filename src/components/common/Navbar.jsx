import React, { useState, useEffect, useCallback } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth }     from '../../context/AuthContext'
import { useCart }     from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import SearchBar       from './SearchBar'

function Navbar() {
  const { isLoggedIn, logout } = useAuth()
  const { cartCount, openCart } = useCart()
  const { wishlistCount }       = useWishlist()
  const navigate                = useNavigate()
  const location                = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('')
      return
    }

    const sectionIds = [
      'new-arrivals',
      'categories',
      'best-sellers',
      'reviews',
      'contact',
      'find-us',
    ]

    const getActiveSection = () => {
      if (window.scrollY < 50) {
        setActiveSection('')
        return
      }

      // FIX: measure navbar height dynamically instead of hardcoding 97
      const navbarEl = document.querySelector('.navbar')
      const navbarHeight = navbarEl ? navbarEl.getBoundingClientRect().height : 80
      const offset = navbarHeight + 20

      let found = ''
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= offset) {
          found = sectionIds[i]
          break
        }
      }
      setActiveSection(found)
    }

    window.addEventListener('scroll', getActiveSection, { passive: true })
    getActiveSection()

    return () => window.removeEventListener('scroll', getActiveSection)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const scrollTo = useCallback((sectionId) => {
    setMenuOpen(false)
    const go = () => {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(go, 420)
    } else {
      go()
    }
  }, [location.pathname, navigate])

  const handleHashClick = useCallback((e, sectionId) => {
    e.preventDefault()
    scrollTo(sectionId)
  }, [scrollTo])

  const navLinks = [
    { label: 'Home',         type: 'route',  path: '/',               end: true },
    { label: 'New Arrivals', type: 'scroll', sectionId: 'new-arrivals' },
    { label: 'Categories',   type: 'scroll', sectionId: 'categories' },
    { label: 'Best Sellers', type: 'scroll', sectionId: 'best-sellers' },
    { label: 'Reviews',      type: 'scroll', sectionId: 'reviews' },
    { label: 'Contact',      type: 'scroll', sectionId: 'contact' },
  ]

  const navSectionIds = ['new-arrivals', 'categories', 'best-sellers', 'reviews', 'contact', 'find-us']
  const activeLinkSection = navSectionIds.includes(activeSection) ? activeSection : ''

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar__announcement">
          <span>FREE SHIPPING ON EVERY ORDER</span>
        </div>

        <div className="navbar__inner">
          <Link
            to="/"
            className="navbar__logo"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          >
            <div className="navbar__logo-emblem">
              <img src="/assests/logo.png" alt="" className="navbar__logo-img" />
              <span className="navbar__logo-initial"></span>
            </div>
            <div className="navbar__logo-text">
              <span className="navbar__logo-name">Resilda's</span>
              <span className="navbar__logo-sub">BOUTIQUE</span>
            </div>
          </Link>

          <div className="navbar__links">
            {navLinks.map((link) => {
              if (link.type === 'route') {
                return (
                  <NavLink
                    key={link.label}
                    to={link.path}
                    end={link.end}
                    className={({ isActive }) =>
                      'navbar__nav-link' +
                      (isActive && !activeLinkSection && activeSection !== 'find-us'
                        ? ' navbar__nav-link--active'
                        : '')
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              }
              return (
                <a
                  key={link.label}
                  href={`/#${link.sectionId}`}
                  className={
                    'navbar__nav-link' +
                    (activeLinkSection === link.sectionId ? ' navbar__nav-link--active' : '')
                  }
                  onClick={(e) => handleHashClick(e, link.sectionId)}
                >
                  {link.label}
                </a>
              )
            })}
          </div>

          <div className="navbar__actions">
            <button
              className="navbar__icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            <button
              className="navbar__icon-btn"
              onClick={() => navigate(isLoggedIn ? '/wishlist' : '/login?redirect=/wishlist')}
              aria-label="Wishlist"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && <span className="navbar__badge">{wishlistCount}</span>}
            </button>

            <button
              className="navbar__icon-btn"
              onClick={openCart}
              aria-label="Cart"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
            </button>

            {isLoggedIn ? (
              <button className="navbar__icon-btn" onClick={handleLogout} title="Logout">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            ) : (
              <Link to="/login" className="navbar__icon-btn" title="Login">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
            )}

            <a
              href="/#find-us"
              className="navbar__find-store"
              onClick={(e) => handleHashClick(e, 'find-us')}
              aria-label="Find Store"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Find Store</span>
            </a>

            <button
              className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`navbar__mobile-menu${menuOpen ? ' open' : ''}`}>
        {navLinks.map((link) => {
          if (link.type === 'route') {
            return (
              <Link key={link.label} to={link.path} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            )
          }
          return (
            <a
              key={link.label}
              href={`/#${link.sectionId}`}
              onClick={(e) => handleHashClick(e, link.sectionId)}
            >
              {link.label}
            </a>
          )
        })}

        <a
          href="/#find-us"
          className="navbar__mobile-findstore"
          onClick={(e) => handleHashClick(e, 'find-us')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Find Store
        </a>

        {isLoggedIn ? (
          <button onClick={() => { handleLogout(); setMenuOpen(false) }}>Logout</button>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
        )}
      </div>

      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  )
}

export default Navbar