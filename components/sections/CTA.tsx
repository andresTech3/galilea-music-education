'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

const schedules = [
  '9:00 AM — 10:00 AM',
  '10:00 AM — 11:00 AM',
  '3:00 PM — 4:00 PM',
  '4:00 PM — 5:00 PM',
  '5:00 PM — 6:00 PM',
]

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.2 }
    )
    const els = sectionRef.current?.querySelectorAll('.anim-reveal')
    els?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="cta-section"
      ref={sectionRef}
      aria-labelledby="cta-title"
    >
      {/* Background decoration */}
      <div className="cta-bg" aria-hidden="true">
        <div className="cta-bg-glow" />
        <div className="cta-bg-grid" />
      </div>

      <div className="container">
        <div className="cta-wrapper">
          {/* Left */}
          <div className="cta-content">
            <span className="section-label anim-reveal">
              ¿Listo para empezar?
            </span>
            <h2
              className="text-h2 anim-reveal"
              id="cta-title"
              style={{ transitionDelay: '0.1s', marginBottom: '20px' }}
            >
              Empieza tu viaje{' '}
              <span className="text-accent">musical</span>{' '}
              hoy
            </h2>
            <p
              className="text-large text-muted anim-reveal"
              style={{ transitionDelay: '0.2s', maxWidth: '480px', marginBottom: '40px' }}
            >
              Únete a más de 200 estudiantes que ya descubrieron el placer de la música. Inscríbete ahora y recibe tu primera clase sin compromiso.
            </p>

            <div className="cta-price anim-reveal" style={{ transitionDelay: '0.3s' }}>
              <div className="cta-price-main">
                <span className="cta-price-amount">$40.000</span>
                <div className="cta-price-detail">
                  <span className="cta-price-currency">COP</span>
                  <span className="cta-price-period">por mes</span>
                </div>
              </div>
              <p className="cta-price-note">Clases de 1 hora • Lunes y Miércoles</p>
            </div>

            <div className="cta-buttons anim-reveal" style={{ transitionDelay: '0.4s' }}>
              <Link
                href="/inscribirse"
                className="btn btn-primary btn-large"
                id="cta-main-enroll-btn"
              >
                Inscríbete Ahora
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <a
                href="tel:+57123456789"
                className="btn btn-ghost btn-large"
                id="cta-phone-btn"
              >
                📞 Llamar ahora
              </a>
            </div>
          </div>

          {/* Right - Schedule */}
          <div className="cta-schedule anim-reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="schedule-card card-glass">
              <div className="schedule-header">
                <div className="schedule-dot-live">
                  <div className="glow-dot" />
                  <span>Horarios disponibles</span>
                </div>
                <p className="schedule-days">📅 Lunes y Miércoles</p>
              </div>

              <ul className="schedule-list" aria-label="Horarios de clases">
                {schedules.map((sch, i) => (
                  <li key={sch} className="schedule-item" style={{ animationDelay: `${0.4 + i * 0.08}s` }}>
                    <div className="schedule-item-dot" />
                    <span>{sch}</span>
                    <span className="schedule-available">Disponible</span>
                  </li>
                ))}
              </ul>

              <div className="schedule-footer">
                <div className="schedule-instruments">
                  <span>🎹 Piano</span>
                  <span>🎸 Guitarra</span>
                  <span>🥁 Batería</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cta-section {
          position: relative;
          padding: var(--space-32) 0;
          overflow: hidden;
        }

        .cta-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .cta-bg-glow {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 0% 50%, rgba(255, 0, 170, 0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 100% 50%, rgba(255, 0, 170, 0.05) 0%, transparent 60%);
        }

        .cta-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .cta-wrapper {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: var(--space-16);
          align-items: center;
        }

        .anim-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .anim-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .cta-price {
          display: flex;
          align-items: center;
          gap: var(--space-6);
          padding: var(--space-6);
          background: var(--color-accent-subtle);
          border: 1px solid rgba(255,0,170,0.2);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-8);
        }

        .cta-price-main {
          display: flex;
          align-items: baseline;
          gap: var(--space-2);
        }

        .cta-price-amount {
          font-family: var(--font-display);
          font-size: 48px;
          font-weight: 700;
          color: var(--color-accent);
          line-height: 1;
        }

        .cta-price-detail {
          display: flex;
          flex-direction: column;
        }

        .cta-price-currency {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-accent);
          opacity: 0.7;
        }

        .cta-price-period {
          font-size: 14px;
          color: var(--color-text-secondary);
        }

        .cta-price-note {
          font-size: 13px;
          color: var(--color-text-muted);
          border-left: 1px solid var(--color-border);
          padding-left: var(--space-6);
        }

        .cta-buttons {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .schedule-card {
          padding: var(--space-6);
        }

        .schedule-header {
          margin-bottom: var(--space-6);
        }

        .schedule-dot-live {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: var(--space-3);
        }

        .schedule-days {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .schedule-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
        }

        .schedule-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: 12px 16px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: 14px;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }

        .schedule-item:hover {
          border-color: var(--color-accent);
          color: var(--color-text-primary);
          background: var(--color-accent-subtle);
        }

        .schedule-item-dot {
          width: 6px;
          height: 6px;
          background: var(--color-accent);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .schedule-available {
          margin-left: auto;
          font-size: 11px;
          color: #00c864;
          font-weight: 600;
          font-family: var(--font-mono);
          letter-spacing: 0.06em;
        }

        .schedule-footer {
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-border);
        }

        .schedule-instruments {
          display: flex;
          gap: var(--space-4);
          justify-content: center;
        }

        .schedule-instruments span {
          font-size: 14px;
          color: var(--color-text-secondary);
        }

        @media (max-width: 1024px) {
          .cta-wrapper {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .cta-price {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-4);
          }

          .cta-price-note {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--color-border);
            padding-top: var(--space-4);
          }

          .cta-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  )
}

