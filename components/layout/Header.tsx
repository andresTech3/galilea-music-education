'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/cursos/piano', label: 'Piano' },
  { href: '/cursos/guitarra', label: 'Guitarra' },
  { href: '/cursos/bateria', label: 'Batería' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/galeria', label: 'Galería' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={`header ${scrolled ? 'header-scrolled' : ''}`}
        role="banner"
      >
        <div className="container">
          <nav className="header-nav" aria-label="Navegación principal">
            {/* Logo */}
            <Link href="/" className="header-logo" aria-label="Galilea Music Education - Inicio">
              <span className="logo-icon">♪</span>
              <div className="logo-text">
                <span className="logo-name">GALILEA</span>
                <span className="logo-subtitle">MUSIC EDUCATION</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <ul className="header-links" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`nav-link ${pathname === link.href ? 'nav-link-active' : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="header-cta">
              <Link
                href="/inscribirse"
                className="btn btn-primary btn-sm"
                id="header-enroll-btn"
              >
                Inscríbete
              </Link>
            </div>

            {/* Hamburger */}
            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              id="mobile-menu-toggle"
            >
              <span />
              <span />
              <span />
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`mobile-overlay ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className="mobile-overlay-header">
          <Link href="/" className="header-logo">
            <span className="logo-icon">♪</span>
            <div className="logo-text">
              <span className="logo-name">GALILEA</span>
              <span className="logo-subtitle">MUSIC EDUCATION</span>
            </div>
          </Link>
          <button
            className="mobile-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-nav" aria-label="Menú móvil">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-nav-item"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span>{link.label}</span>
              <span className="mobile-nav-arrow">→</span>
            </Link>
          ))}
        </nav>

        <div className="mobile-nav-footer">
          <Link href="/inscribirse" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Inscríbete Ahora
          </Link>
          <a href="tel:+57123456789" className="mobile-phone">
            📞 123 456 789
          </a>
        </div>
      </div>

      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--z-nav);
          height: var(--nav-height);
          transition: all var(--transition-normal);
          background: transparent;
        }

        .header-scrolled {
          background: rgba(17, 17, 17, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--color-border);
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }

        .header-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--nav-height);
          gap: var(--space-6);
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          transition: opacity var(--transition-fast);
        }

        .header-logo:hover {
          opacity: 0.85;
        }

        .logo-icon {
          font-size: 28px;
          color: var(--color-accent);
          filter: drop-shadow(0 0 8px var(--color-accent));
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .logo-name {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-text-primary);
          letter-spacing: 0.1em;
        }

        .logo-subtitle {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 400;
          color: var(--color-accent);
          letter-spacing: 0.18em;
        }

        .header-links {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          list-style: none;
          flex: 1;
          justify-content: center;
        }

        .nav-link-active {
          color: var(--color-text-primary) !important;
        }

        .nav-link-active::after {
          width: 100% !important;
        }

        .header-cta {
          flex-shrink: 0;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          cursor: pointer;
          background: none;
          border: none;
        }

        .hamburger span {
          display: block;
          width: 24px;
          height: 1.5px;
          background: var(--color-text-primary);
          transition: all var(--transition-normal);
          transform-origin: left center;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translateY(-1px);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translateY(1px);
        }

        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: calc(var(--z-nav) + 10);
          background: var(--color-bg);
          flex-direction: column;
          padding: var(--space-6);
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-overlay.open {
          transform: translateX(0);
        }

        .mobile-overlay-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--nav-height);
          margin-bottom: var(--space-8);
        }

        .mobile-close {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: var(--color-text-secondary);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .mobile-close:hover {
          color: var(--color-accent);
          border-color: var(--color-accent);
        }

        .mobile-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-5) 0;
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          color: var(--color-text-primary);
          border-bottom: 1px solid var(--color-border);
          transition: color var(--transition-fast);
          opacity: 0;
          animation: fade-in-up 0.4s ease forwards;
        }

        .mobile-overlay.open .mobile-nav-item {
          opacity: 1;
        }

        .mobile-nav-item:hover {
          color: var(--color-accent);
        }

        .mobile-nav-arrow {
          font-size: 20px;
          opacity: 0.4;
        }

        .mobile-nav-footer {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          padding-top: var(--space-6);
        }

        .mobile-phone {
          text-align: center;
          color: var(--color-text-secondary);
          font-size: 16px;
          padding: var(--space-3);
          transition: color var(--transition-fast);
        }

        .mobile-phone:hover {
          color: var(--color-accent);
        }

        @media (max-width: 1024px) {
          .header-links {
            display: none;
          }
          .header-cta {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .mobile-overlay {
            display: flex;
          }
        }
      `}</style>
    </>
  )
}

