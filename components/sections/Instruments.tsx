'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const instruments = [
  {
    name: 'Piano',
    slug: 'piano',
    icon: '🎹',
    teacher: 'Andrés Narváez',
    description: 'Domina el instrumento más completo del mundo. Desde escalas básicas hasta composición e improvisación.',
    image: '/images/piano-hero.png',
    level: 'Todos los niveles',
    color: '#ff00aa',
  },
  {
    name: 'Guitarra',
    slug: 'guitarra',
    icon: '🎸',
    teacher: 'Danco Padilla',
    description: 'Aprende el instrumento más popular del planeta. Acústica, eléctrica, rasgueos y fingerpicking.',
    image: '/images/guitar-section.png',
    level: 'Todos los niveles',
    color: '#ff00aa',
  },
  {
    name: 'Batería',
    slug: 'bateria',
    icon: '🥁',
    teacher: 'José Ricardo',
    description: 'Conviértete en el motor rítmico de cualquier banda. Ritmos, coordinación y estilos múltiples.',
    image: '/images/drums-section.png',
    level: 'Todos los niveles',
    color: '#ff00aa',
  },
]

function InstrumentCard({ instrument, index }: { instrument: typeof instruments[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className="instrument-card-wrapper anim-slide-up"
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <Link
        href={`/cursos/${instrument.slug}`}
        className="instr-card"
        id={`instrument-card-${instrument.slug}`}
        aria-label={`Ver cursos de ${instrument.name}`}
      >
        {/* Image */}
        <div className="instr-card-image">
          <Image
            src={instrument.image}
            alt={`Clases de ${instrument.name} en Galilea Music Education`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="instr-img"
            priority={index === 0}
          />
          <div className="instr-card-overlay" />
          <div className="instr-card-icon">{instrument.icon}</div>
        </div>

        {/* Content */}
        <div className="instr-card-content">
          <div className="instr-card-header">
            <span className="badge badge-accent" style={{ marginBottom: '12px' }}>
              {instrument.level}
            </span>
            <h3 className="text-h3" style={{ marginBottom: '8px' }}>{instrument.name}</h3>
            <p className="instr-teacher">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {instrument.teacher}
            </p>
          </div>
          <p className="instr-desc">{instrument.description}</p>

          <div className="instr-card-footer">
            <div className="instr-price">
              <span className="stat-number" style={{ fontSize: '24px' }}>$40.000</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>/ mes</span>
            </div>
            <span className="instr-cta">
              Ver cursos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Glow effect */}
        <div className="instr-glow" aria-hidden="true" />
      </Link>
    </div>
  )
}

export default function Instruments() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
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

    const els = sectionRef.current?.querySelectorAll('.anim-reveal')
    els?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="section instruments-section"
      id="instrumentos"
      ref={sectionRef}
      aria-labelledby="instruments-title"
    >
      <div className="container">
        {/* Header */}
        <div className="instruments-header text-center">
          <span className="section-label anim-reveal" style={{ justifyContent: 'center' }}>
            Nuestros Programas
          </span>
          <h2
            className="text-h2 anim-reveal"
            id="instruments-title"
            style={{ transitionDelay: '0.1s', marginBottom: '16px' }}
          >
            Elige tu <span className="text-accent">instrumento</span>
          </h2>
          <p
            className="text-large text-muted anim-reveal"
            style={{ transitionDelay: '0.2s', maxWidth: '560px', margin: '0 auto 64px' }}
          >
            Tres disciplinas, tres maestros especializados. Aprende a tu ritmo con clases diseñadas para todos los niveles.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="instruments-grid">
          {instruments.map((instrument, index) => (
            <InstrumentCard key={instrument.slug} instrument={instrument} index={index} />
          ))}
        </div>
      </div>

      <style>{`
        .instruments-section {
          background: var(--color-bg-1);
          position: relative;
        }

        .instruments-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-border), transparent);
        }

        .instruments-header .anim-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .instruments-header .anim-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .instruments-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }

        .instrument-card-wrapper {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .instrument-card-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .instr-card {
          display: flex;
          flex-direction: column;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--transition-normal);
          position: relative;
          cursor: pointer;
          text-decoration: none;
        }

        .instr-card:hover {
          border-color: rgba(255, 0, 170, 0.4);
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px var(--color-accent-glow);
        }

        .instr-card-image {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .instr-img {
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .instr-card:hover .instr-img {
          transform: scale(1.05);
        }

        .instr-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.2) 0%,
            rgba(17,17,17,0.8) 100%
          );
          z-index: 1;
        }

        .instr-card-icon {
          position: absolute;
          top: var(--space-4);
          right: var(--space-4);
          z-index: 2;
          font-size: 40px;
          filter: drop-shadow(0 0 12px rgba(255,0,170,0.6));
          transition: transform var(--transition-normal);
        }

        .instr-card:hover .instr-card-icon {
          transform: scale(1.15) rotate(-8deg);
        }

        .instr-card-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: var(--space-6);
          gap: var(--space-4);
        }

        .instr-card-header {
          display: flex;
          flex-direction: column;
        }

        .instr-teacher {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--color-text-muted);
        }

        .instr-desc {
          font-size: 14px;
          line-height: 1.7;
          color: var(--color-text-secondary);
          flex: 1;
        }

        .instr-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-border);
        }

        .instr-price {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .instr-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-accent);
          transition: gap var(--transition-fast);
        }

        .instr-card:hover .instr-cta {
          gap: 10px;
        }

        .instr-glow {
          position: absolute;
          bottom: -40px;
          right: -40px;
          width: 160px;
          height: 160px;
          background: radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%);
          pointer-events: none;
          opacity: 0;
          transition: opacity var(--transition-slow);
        }

        .instr-card:hover .instr-glow {
          opacity: 1;
        }

        @media (max-width: 1024px) {
          .instruments-grid {
            grid-template-columns: 1fr;
            max-width: 560px;
            margin: 0 auto;
          }

          .instr-card {
            flex-direction: row;
          }

          .instr-card-image {
            width: 200px;
            height: auto;
            flex-shrink: 0;
          }
        }

        @media (max-width: 640px) {
          .instr-card {
            flex-direction: column;
          }

          .instr-card-image {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>
    </section>
  )
}
