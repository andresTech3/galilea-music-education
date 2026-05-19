'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Testimonial } from '@/lib/supabase/types'

const instrumentEmoji: Record<string, string> = {
  piano: '🎹',
  guitarra: '🎸',
  bateria: '🥁',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="stars" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ opacity: i < rating ? 1 : 0.2 }}>★</span>
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className="testimonial-card-anim"
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div className="testimonial-card">
        <div className="testimonial-top">
          <div className="testimonial-avatar">
            {testimonial.student_name.charAt(0)}
          </div>
          <div className="testimonial-meta">
            <p className="testimonial-name">{testimonial.student_name}</p>
            {testimonial.instrument_slug && (
              <p className="testimonial-instrument">
                {instrumentEmoji[testimonial.instrument_slug] || '🎵'}{' '}
                {testimonial.instrument_slug.charAt(0).toUpperCase() + testimonial.instrument_slug.slice(1)}
              </p>
            )}
          </div>
        </div>
        <StarRating rating={testimonial.rating} />
        <blockquote className="testimonial-quote">
          &ldquo;{testimonial.comment}&rdquo;
        </blockquote>
        <div className="testimonial-big-quote" aria-hidden="true">&ldquo;</div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (!error && data) {
        setTestimonials(data as Testimonial[])
      }
      setLoading(false)
    }

    fetchTestimonials()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
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
      className="section testimonials-section"
      id="testimonios"
      ref={sectionRef}
      aria-labelledby="testimonials-title"
    >
      <div className="container">
        <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
          <span className="section-label anim-reveal" style={{ justifyContent: 'center' }}>
            Lo que dicen nuestros estudiantes
          </span>
          <h2
            className="text-h2 anim-reveal"
            id="testimonials-title"
            style={{ transitionDelay: '0.1s' }}
          >
            Historias de <span className="text-accent">éxito</span>
          </h2>
        </div>

        {loading ? (
          <div className="testimonials-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : (
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .testimonials-section {
          background: var(--color-bg-1);
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }

        .testimonial-card-anim {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .testimonial-card-anim.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .testimonial-card {
          position: relative;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          overflow: hidden;
          transition: all var(--transition-normal);
        }

        .testimonial-card:hover {
          border-color: rgba(255,0,170,0.25);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 20px var(--color-accent-glow);
        }

        .testimonial-top {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .testimonial-avatar {
          width: 48px;
          height: 48px;
          background: var(--color-accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .testimonial-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .testimonial-instrument {
          font-size: 13px;
          color: var(--color-text-muted);
          margin-top: 2px;
        }

        .testimonial-quote {
          font-size: 14px;
          line-height: 1.7;
          color: var(--color-text-secondary);
          flex: 1;
          font-style: italic;
        }

        .testimonial-big-quote {
          position: absolute;
          bottom: var(--space-2);
          right: var(--space-4);
          font-size: 100px;
          line-height: 0.7;
          color: var(--color-accent);
          opacity: 0.08;
          font-family: Georgia, serif;
          pointer-events: none;
        }

        .anim-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .anim-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 1024px) {
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .testimonials-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
