'use client'

import { useEffect, useRef, useState } from 'react'

interface StatItem {
  num: number
  suffix: string
  label: string
  icon: string
}

const stats: StatItem[] = [
  { num: 5, suffix: '+', label: 'Años de Experiencia', icon: '🏆' },
  { num: 200, suffix: '+', label: 'Estudiantes Satisfechos', icon: '🎓' },
  { num: 3, suffix: '', label: 'Maestros Especializados', icon: '👨‍🎓' },
  { num: 3, suffix: '', label: 'Instrumentos Disponibles', icon: '🎵' },
]

function CounterNumber({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    const duration = 1800
    const startTime = Date.now()
    const start = 0

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.round(start + (target - start) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [active, target])

  return (
    <span className="stat-number">
      {count}{suffix}
    </span>
  )
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !active) {
          setActive(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [active])

  return (
    <section className="stats-section" ref={sectionRef} aria-label="Estadísticas del instituto">
      {/* Decorative line */}
      <div className="stats-line" aria-hidden="true" />

      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="stat-card card-glass"
              style={{
                animation: active ? `fade-in-up 0.6s ease ${index * 0.1}s forwards` : 'none',
                opacity: active ? undefined : 0,
              }}
            >
              <span className="stat-icon" aria-hidden="true">{stat.icon}</span>
              <CounterNumber target={stat.num} suffix={stat.suffix} active={active} />
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stats-section {
          padding: var(--space-20) 0;
          background: var(--color-bg);
          position: relative;
        }

        .stats-line {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-border), transparent);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
        }

        .stat-card {
          padding: var(--space-8);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          transition: all var(--transition-normal);
        }

        .stat-card:hover {
          border-color: rgba(255, 0, 170, 0.25);
          box-shadow: 0 0 30px var(--color-accent-glow);
        }

        .stat-icon {
          font-size: 28px;
          margin-bottom: var(--space-1);
        }

        .stat-label {
          font-size: 13px;
          color: var(--color-text-secondary);
          font-weight: 500;
          text-align: center;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
