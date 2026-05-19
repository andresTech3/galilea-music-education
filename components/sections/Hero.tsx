'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Lazy load the 3D scene for performance
const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="hero-canvas-placeholder" aria-hidden="true">
      <div className="hero-canvas-loader" />
    </div>
  ),
})

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Intersection observer for entrance animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const els = heroRef.current?.querySelectorAll('.anim-reveal')
    els?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="hero" ref={heroRef} aria-label="Sección principal">
      {/* Animated background gradient */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg-gradient" />
        <div className="hero-bg-grid" />
      </div>

      {/* 3D Canvas */}
      <div className="hero-canvas" aria-hidden="true">
        <HeroScene />
        <div className="hero-canvas-fade" />
      </div>

      {/* Content */}
      <div className="container">
        <div className="hero-content" ref={textRef}>
          {/* Label */}
          <div className="anim-reveal hero-label">
            <span className="section-label">
              Instituto de Música
            </span>
            <div className="glow-dot" />
          </div>

          {/* Title */}
          <h1 className="anim-reveal hero-title text-hero">
            <span className="hero-title-line">GALILEA</span>
            <span className="hero-title-line hero-title-accent">MUSIC</span>
            <span className="hero-title-line">EDUCATION</span>
          </h1>

          {/* Subtitle */}
          <p className="anim-reveal hero-desc text-large text-muted">
            Clases profesionales de <strong className="text-accent">Piano</strong>,{' '}
            <strong className="text-accent">Guitarra</strong> y{' '}
            <strong className="text-accent">Batería</strong> en el Barrio Piñalito.
            <br />
            Desde <span className="hero-price">$40.000 COP/mes</span>
          </p>

          {/* CTA Buttons */}
          <div className="anim-reveal hero-cta">
            <Link
              href="/inscribirse"
              className="btn btn-primary btn-large"
              id="hero-enroll-btn"
            >
              <span>Inscríbete Ahora</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="#instrumentos"
              className="btn btn-ghost btn-large"
              id="hero-explore-btn"
            >
              Ver Instrumentos
            </Link>
          </div>

          {/* Quick stats */}
          <div className="anim-reveal hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">3</span>
              <span className="hero-stat-label">Instrumentos</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">3</span>
              <span className="hero-stat-label">Maestros Especializados</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">5</span>
              <span className="hero-stat-label">Horarios Disponibles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator" aria-label="Desplázate hacia abajo">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Desplázate</span>
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding-top: var(--nav-height);
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-bg-gradient {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 70% 50%, rgba(255, 0, 170, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(255, 0, 170, 0.04) 0%, transparent 50%);
        }

        .hero-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }

        .hero-canvas {
          position: absolute;
          right: 0;
          top: 0;
          width: 55%;
          height: 100%;
          z-index: 1;
        }

        .hero-canvas-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            var(--color-bg) 0%,
            transparent 30%,
            transparent 70%,
            var(--color-bg) 100%
          );
          pointer-events: none;
        }

        .hero-canvas-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-canvas-loader {
          width: 60px;
          height: 60px;
          border: 2px solid var(--color-border);
          border-top-color: var(--color-accent);
          border-radius: 50%;
          animation: spin-slow 1s linear infinite;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 680px;
          padding: var(--space-20) 0;
        }

        /* Staggered reveal animation */
        .anim-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .anim-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-label {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          transition-delay: 0.1s;
        }

        .hero-title {
          margin-bottom: var(--space-6);
          display: flex;
          flex-direction: column;
          transition-delay: 0.2s;
        }

        .hero-title-line {
          display: block;
          line-height: 0.92;
        }

        .hero-title-accent {
          color: var(--color-accent);
          text-shadow: 0 0 40px rgba(255, 0, 170, 0.4);
          -webkit-text-stroke: 1px var(--color-accent);
          color: transparent;
        }

        .hero-desc {
          margin-bottom: var(--space-8);
          max-width: 520px;
          transition-delay: 0.3s;
        }

        .hero-price {
          display: inline-block;
          background: var(--color-accent-subtle);
          border: 1px solid rgba(255, 0, 170, 0.2);
          color: var(--color-accent);
          padding: 2px 10px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 16px;
        }

        .hero-cta {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-12);
          transition-delay: 0.4s;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: var(--space-6);
          transition-delay: 0.5s;
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hero-stat-num {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          color: var(--color-accent);
          line-height: 1;
        }

        .hero-stat-label {
          font-size: 12px;
          color: var(--color-text-muted);
          letter-spacing: 0.04em;
        }

        .hero-stat-divider {
          width: 1px;
          height: 40px;
          background: var(--color-border);
        }

        .hero-scroll-indicator {
          position: absolute;
          bottom: var(--space-8);
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--color-text-muted);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .scroll-mouse {
          width: 22px;
          height: 36px;
          border: 1.5px solid var(--color-border);
          border-radius: 12px;
          display: flex;
          justify-content: center;
          padding-top: 6px;
        }

        .scroll-wheel {
          width: 3px;
          height: 8px;
          background: var(--color-accent);
          border-radius: 2px;
          animation: scroll-down 2s ease-in-out infinite;
        }

        @keyframes scroll-down {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }

        @media (max-width: 1024px) {
          .hero-canvas {
            width: 100%;
            opacity: 0.3;
          }
          .hero-canvas-fade {
            background: linear-gradient(
              to bottom,
              transparent 0%,
              var(--color-bg) 80%
            );
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            padding: var(--space-12) 0;
          }
          .hero-cta {
            flex-direction: column;
            align-items: stretch;
          }
          .hero-cta .btn {
            justify-content: center;
          }
          .hero-stats {
            flex-wrap: wrap;
            gap: var(--space-4);
          }
          .hero-stat-divider {
            display: none;
          }
          .hero-scroll-indicator {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}
