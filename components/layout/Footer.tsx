import Link from 'next/link'

const footerLinks = {
  instrumentos: [
    { href: '/cursos/piano', label: 'Clases de Piano' },
    { href: '/cursos/guitarra', label: 'Clases de Guitarra' },
    { href: '/cursos/bajo', label: 'Clases de Bajo' },
    { href: '/cursos/bateria', label: 'Clases de Batería' },
  ],
  instituto: [
    { href: '/nosotros', label: 'Sobre Nosotros' },
    { href: '/galeria', label: 'Galería' },
    { href: '/inscribirse', label: 'Inscribirse' },
    { href: '/contacto', label: 'Contacto' },
  ],
}

const schedules = [
  '9:00 AM — 10:00 AM',
  '10:00 AM — 11:00 AM',
  '3:00 PM — 4:00 PM',
  '4:00 PM — 5:00 PM',
  '5:00 PM — 6:00 PM',
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      {/* Top glow */}
      <div className="footer-glow" aria-hidden="true" />

      <div className="container">
        {/* Main grid */}
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="Galilea Music Education - Inicio">
              <span className="footer-logo-icon">♪</span>
              <div>
                <div className="footer-logo-name">GALILEA</div>
                <div className="footer-logo-sub">MUSIC EDUCATION</div>
              </div>
            </Link>
            <p className="footer-tagline">
              Formando músicos con pasión, técnica y disciplina. Tu aventura musical empieza aquí.
            </p>
            <div className="footer-contact">
              <a href="tel:+57123456789" className="footer-contact-item" id="footer-phone-link">
                <span className="footer-contact-icon">📞</span>
                <span>123 456 789</span>
              </a>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📍</span>
                <span>Barrio Piñalito</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">🗓</span>
                <span>Lunes y Miércoles</span>
              </div>
            </div>

            {/* Social placeholders */}
            <div className="footer-social">
              <span className="footer-social-label">Redes sociales proximamente</span>
              <div className="footer-social-icons">
                <a href="#" className="social-icon" aria-label="Instagram (próximamente)" id="footer-instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Facebook (próximamente)" id="footer-facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="TikTok (próximamente)" id="footer-tiktok">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.77 1.52V6.73a4.85 4.85 0 0 1-1-.04z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Instrumentos */}
          <div className="footer-col">
            <h3 className="footer-col-title">Instrumentos</h3>
            <ul className="footer-links-list">
              {footerLinks.instrumentos.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    <span className="footer-link-arrow">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Instituto */}
          <div className="footer-col">
            <h3 className="footer-col-title">Instituto</h3>
            <ul className="footer-links-list">
              {footerLinks.instituto.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    <span className="footer-link-arrow">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Horarios */}
          <div className="footer-col">
            <h3 className="footer-col-title">Horarios</h3>
            <p className="footer-schedule-days">Lunes y Miércoles</p>
            <ul className="footer-schedules">
              {schedules.map((sch) => (
                <li key={sch} className="footer-schedule-item">
                  <span className="schedule-dot" />
                  {sch}
                </li>
              ))}
            </ul>
            <div className="footer-price-badge">
              <span className="price-amount">$40.000</span>
              <span className="price-period">COP / mes</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} Galilea Music Education. Todos los derechos reservados.
          </p>
          <p className="footer-made">
            Hecho con <span style={{ color: 'var(--color-accent)' }}>♪</span> para la música
          </p>
        </div>
      </div>

      <style>{`
        .footer {
          position: relative;
          background: var(--color-bg-1);
          border-top: 1px solid var(--color-border);
          padding-top: var(--space-20);
          padding-bottom: var(--space-8);
          overflow: hidden;
        }

        .footer-glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: var(--space-12);
          margin-bottom: var(--space-16);
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: var(--space-6);
        }

        .footer-logo-icon {
          font-size: 32px;
          color: var(--color-accent);
          filter: drop-shadow(0 0 8px var(--color-accent));
        }

        .footer-logo-name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: var(--color-text-primary);
          letter-spacing: 0.1em;
        }

        .footer-logo-sub {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--color-accent);
          letter-spacing: 0.18em;
        }

        .footer-tagline {
          color: var(--color-text-secondary);
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: var(--space-6);
          max-width: 320px;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }

        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: 14px;
          color: var(--color-text-secondary);
          transition: color var(--transition-fast);
          text-decoration: none;
        }

        .footer-contact-item:hover {
          color: var(--color-accent);
        }

        .footer-contact-icon {
          font-size: 16px;
        }

        .footer-social-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--color-text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: var(--space-3);
        }

        .footer-social-icons {
          display: flex;
          gap: var(--space-3);
        }

        .social-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-text-secondary);
          transition: all var(--transition-normal);
        }

        .social-icon:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-subtle);
          transform: translateY(-2px);
        }

        .footer-col-title {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: var(--space-6);
        }

        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 14px;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }

        .footer-link:hover {
          color: var(--color-text-primary);
          transform: translateX(4px);
        }

        .footer-link-arrow {
          color: var(--color-accent);
          font-size: 12px;
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .footer-link:hover .footer-link-arrow {
          opacity: 1;
        }

        .footer-schedule-days {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: var(--space-4);
          font-family: var(--font-mono);
          letter-spacing: 0.04em;
        }

        .footer-schedules {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
        }

        .footer-schedule-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: 13px;
          color: var(--color-text-secondary);
        }

        .schedule-dot {
          width: 5px;
          height: 5px;
          background: var(--color-accent);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .footer-price-badge {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          padding: 12px 18px;
          background: var(--color-accent-subtle);
          border: 1px solid rgba(255, 0, 170, 0.2);
          border-radius: var(--radius-sm);
        }

        .price-amount {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--color-accent);
        }

        .price-period {
          font-size: 13px;
          color: var(--color-text-secondary);
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: var(--space-8);
          border-top: 1px solid var(--color-border);
        }

        .footer-copy,
        .footer-made {
          font-size: 13px;
          color: var(--color-text-muted);
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }
          .footer-bottom {
            flex-direction: column;
            gap: var(--space-2);
            text-align: center;
          }
        }
      `}</style>
    </footer>
  )
}

