import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { createReadOnlyClient } from '@/lib/supabase/server'

export const revalidate = 3600 // 1 hour ISR

interface InstrumentConfig {
  name: string
  slug: string
  icon: string
  image: string
  teacher: string
  teacherBio: string
  teacherSpecialty: string
  description: string
  benefits: string[]
  levels: Array<{ name: string; badge: string; desc: string }>
}

const instrumentsConfig: Record<string, InstrumentConfig> = {
  piano: {
    name: 'Piano',
    slug: 'piano',
    icon: '🎹',
    image: '/images/piano-hero.png',
    teacher: 'Andrés Narváez',
    teacherBio: 'Músico y pedagogo con 5+ años de experiencia. Especialista en piano clásico, jazz y pop.',
    teacherSpecialty: 'Piano Clásico, Jazz, Pop',
    description:
      'El piano es considerado el instrumento más completo del mundo. Dominar el piano te abre las puertas a la teoría musical, la armonía y la composición. En Galilea Music Education aprendes con un método progresivo y personalizado.',
    benefits: [
      'Desarrollas lectura de partitura',
      'Fundamentos de teoría musical',
      'Repertorio variado (clásico, pop, jazz)',
      'Técnica y postura correctas',
      'Habilidades de improvisación',
      'Bases de composición',
    ],
    levels: [
      { name: 'Principiante', badge: 'beginner', desc: 'Comienzas desde cero: notas, escalas y tus primeras canciones.' },
      { name: 'Intermedio', badge: 'intermediate', desc: 'Profundizas en armonía, técnica avanzada y repertorio diverso.' },
    ],
  },
  guitarra: {
    name: 'Guitarra',
    slug: 'guitarra',
    icon: '🎸',
    image: '/images/guitar-section.png',
    teacher: 'Danco Padilla',
    teacherBio: 'Guitarrista profesional con 5+ años formando músicos. Experto en acústica, eléctrica y fingerpicking.',
    teacherSpecialty: 'Guitarra Acústica y Eléctrica, Fingerpicking',
    description:
      'La guitarra es el instrumento más popular del mundo. Versátil y expresiva, te permite tocar desde pop y rock hasta jazz y folclor. Aprende con técnica correcta desde el primer día para evitar malos hábitos.',
    benefits: [
      'Acordes y progresiones básicas a avanzadas',
      'Técnicas de rasgueo y fingerpicking',
      'Escalas y solos de guitarra',
      'Múltiples géneros musicales',
      'Lectura de tablaturas',
      'Mantenimiento del instrumento',
    ],
    levels: [
      { name: 'Principiante', badge: 'beginner', desc: 'Aprende acordes básicos, rasgueos y tus primeras canciones completas.' },
      { name: 'Intermedio', badge: 'intermediate', desc: 'Técnicas avanzadas: barre chords, escalas, solos y géneros múltiples.' },
    ],
  },
  bateria: {
    name: 'Batería',
    slug: 'bateria',
    icon: '🥁',
    image: '/images/drums-section.png',
    teacher: 'José Ricardo',
    teacherBio: 'Baterista con 12+ años de experiencia en bandas de rock, cumbia y salsa. Experto en ritmos latinoamericanos.',
    teacherSpecialty: 'Batería Rock, Ritmos Latinoamericanos',
    description:
      'La batería es el corazón rítmico de cualquier banda. Más que golpear parches, la batería es coordinación, ritmo interno y expresión. Nuestro método desarrolla tu oído rítmico desde el primer día.',
    benefits: [
      'Desarrollo del sentido del ritmo',
      'Coordinación manos-pies',
      'Rudimentos de percusión',
      'Ritmos: rock, pop, cumbia, salsa',
      'Fills y variaciones rítmicas',
      'Dinámica y control del volumen',
    ],
    levels: [
      { name: 'Principiante', badge: 'beginner', desc: 'Ritmos básicos, coordinación fundamental y tu primer groove completo.' },
      { name: 'Intermedio', badge: 'intermediate', desc: 'Fills complejos, variaciones rítmicas y estilos múltiples.' },
    ],
  },
  bajo: {
    name: 'Bajo',
    slug: 'bajo',
    icon: '🎸',
    image: '/images/bass-section.png',
    teacher: 'Danco Padilla',
    teacherBio: 'Guitarrista y bajista profesional con 5+ años formando músicos. Especialista en cuerdas pulsadas.',
    teacherSpecialty: 'Guitarra, Bajo Eléctrico, Fingerpicking',
    description:
      'El bajo eléctrico es la columna vertebral de la música moderna, fusionando el ritmo y la armonía. Aprende a crear líneas sólidas, dominar técnicas de dedos, púa y slap, y a conectarte a la perfección con la batería.',
    benefits: [
      'Control del tempo y ritmo preciso',
      'Técnicas de pulsación (dedos, púa, slap y pop)',
      'Escalas, arpegios y teoría armónica aplicada',
      'Creación de líneas de bajo creativas',
      'Entrenamiento auditivo rítmico',
      'Ensamble y sincronía con la batería',
    ],
    levels: [
      { name: 'Principiante', badge: 'beginner', desc: 'Postura, digitación, escalas básicas y tus primeras líneas de bajo.' },
      { name: 'Intermedio', badge: 'intermediate', desc: 'Slap y pop básico, improvisación, armonía y ensamble rítmico avanzado.' },
    ],
  },
}

const schedules = [
  { time: '9:00 AM — 10:00 AM', label: 'Mañana' },
  { time: '10:00 AM — 11:00 AM', label: 'Mañana' },
  { time: '3:00 PM — 4:00 PM', label: 'Tarde' },
  { time: '4:00 PM — 5:00 PM', label: 'Tarde' },
  { time: '5:00 PM — 6:00 PM', label: 'Tarde' },
]

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const config = instrumentsConfig[slug]
  if (!config) return {}

  return {
    title: `Clases de ${config.name} | Galilea Music Education`,
    description: `Aprende ${config.name} con ${config.teacher} en Galilea Music Education. Clases para todos los niveles, $40.000 COP/mes. Lunes y Miércoles en Barrio Piñalito.`,
    alternates: { canonical: `/cursos/${slug}` },
  }
}

export async function generateStaticParams() {
  return [{ slug: 'piano' }, { slug: 'guitarra' }, { slug: 'bateria' }, { slug: 'bajo' }]
}

export default async function CursoPage({ params }: Props) {
  const { slug } = await params
  const config = instrumentsConfig[slug]
  if (!config) notFound()

  // Fetch real courses from Supabase
  const supabase = createReadOnlyClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('*, teachers(*)')
    .eq('is_active', true)
    .ilike('name', `%${config.name}%`)
    .order('level', { ascending: true })

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `Clases de ${config.name} — Galilea Music Education`,
    description: config.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Galilea Music Education',
    },
    instructor: {
      '@type': 'Person',
      name: config.teacher,
    },
    offers: {
      '@type': 'Offer',
      price: '40000',
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <Header />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        {/* Hero */}
        <section className="curso-hero">
          <div className="curso-hero-image">
            <Image
              src={config.image}
              alt={`Clases de ${config.name} en Galilea Music Education`}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
            <div className="curso-hero-overlay" />
          </div>

          <div className="container">
            <div className="curso-hero-content">
              <Link href="/" className="curso-breadcrumb">
                ← Inicio / Cursos / {config.name}
              </Link>
              <div className="curso-icon">{config.icon}</div>
              <h1 className="text-h2" style={{ marginBottom: '16px' }}>
                Clases de <span className="text-accent">{config.name}</span>
              </h1>
              <p className="text-large" style={{ opacity: 0.85, maxWidth: '600px', marginBottom: '32px' }}>
                {config.description}
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href="/inscribirse" className="btn btn-primary btn-large" id={`${slug}-hero-enroll`}>
                  Inscribirme en {config.name}
                </Link>
                <a href="tel:+57123456789" className="btn btn-ghost btn-large">
                  📞 Más información
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Course Details */}
        <section className="section">
          <div className="container">
            <div className="curso-detail-grid">
              {/* Left: Info */}
              <div>
                {/* Teacher */}
                <div className="card" style={{ marginBottom: '24px' }}>
                  <h2 className="text-h4" style={{ marginBottom: '16px' }}>Tu maestro</h2>
                  <div className="teacher-mini">
                    <div className="teacher-mini-avatar">{config.icon}</div>
                    <div>
                      <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{config.teacher}</p>
                      <p style={{ fontSize: '13px', color: 'var(--color-accent)', marginBottom: '8px' }}>{config.teacherSpecialty}</p>
                      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{config.teacherBio}</p>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="card">
                  <h2 className="text-h4" style={{ marginBottom: '16px' }}>¿Qué aprenderás?</h2>
                  <ul className="benefits-list">
                    {config.benefits.map((b) => (
                      <li key={b} className="benefit-item">
                        <span className="benefit-check">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Courses + Schedule */}
              <div>
                {/* Available Courses */}
                <div style={{ marginBottom: '24px' }}>
                  <h2 className="text-h4" style={{ marginBottom: '16px' }}>Niveles disponibles</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {config.levels.map((level) => (
                      <div key={level.name} className="level-card card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span className={`badge badge-${level.badge}`}>{level.name}</span>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                            $40.000 COP/mes
                          </span>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{level.desc}</p>
                      </div>
                    ))}

                    {courses && courses.length > 0 && (
                      <div className="card" style={{ borderColor: 'rgba(255,0,170,0.2)' }}>
                        <p className="text-xs text-muted" style={{ marginBottom: '8px' }}>
                          CURSOS ACTIVOS EN SUPABASE
                        </p>
                        {courses.map((c) => (
                          <div key={c.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                            ✦ {c.name} — {c.current_students}/{c.max_students} estudiantes
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Schedule */}
                <div className="card" style={{ marginBottom: '24px' }}>
                  <h2 className="text-h4" style={{ marginBottom: '4px' }}>Horarios</h2>
                  <p className="text-muted text-small" style={{ marginBottom: '16px' }}>📅 Lunes y Miércoles</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {schedules.map((s) => (
                      <div key={s.time} className="schedule-item">
                        <div className="schedule-item-dot" />
                        <span>{s.time}</span>
                        <span className="badge badge-outline" style={{ marginLeft: 'auto', fontSize: '11px' }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Card */}
                <div className="card" style={{ background: 'var(--color-accent-subtle)', borderColor: 'rgba(255,0,170,0.25)', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎵</div>
                  <h3 className="text-h4" style={{ marginBottom: '8px' }}>$40.000 COP / mes</h3>
                  <p className="text-muted text-small" style={{ marginBottom: '20px' }}>Clases de 1 hora • Lunes y Miércoles</p>
                  <Link
                    href="/inscribirse"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    id={`${slug}-sidebar-enroll`}
                  >
                    Inscribirme en {config.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .curso-hero {
          position: relative;
          min-height: 60vh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .curso-hero-image {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .curso-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            var(--color-bg) 0%,
            rgba(17,17,17,0.7) 50%,
            rgba(17,17,17,0.4) 100%
          );
        }

        .curso-hero-content {
          position: relative;
          z-index: 1;
          padding: var(--space-16) 0 var(--space-20);
        }

        .curso-breadcrumb {
          display: inline-block;
          font-size: 13px;
          color: var(--color-text-muted);
          margin-bottom: var(--space-4);
          transition: color var(--transition-fast);
        }

        .curso-breadcrumb:hover {
          color: var(--color-accent);
        }

        .curso-icon {
          font-size: 60px;
          margin-bottom: var(--space-4);
          filter: drop-shadow(0 0 20px rgba(255,0,170,0.5));
        }

        .curso-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-8);
          align-items: start;
        }

        .teacher-mini {
          display: flex;
          gap: var(--space-4);
          align-items: flex-start;
        }

        .teacher-mini-avatar {
          width: 60px;
          height: 60px;
          background: var(--color-accent-subtle);
          border: 2px solid rgba(255,0,170,0.2);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
        }

        .benefits-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: 14px;
          color: var(--color-text-secondary);
        }

        .benefit-check {
          width: 20px;
          height: 20px;
          background: rgba(0,200,100,0.1);
          border: 1px solid rgba(0,200,100,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: #00c864;
          flex-shrink: 0;
          font-weight: 700;
        }

        .level-card {
          transition: all var(--transition-normal);
        }

        .level-card:hover {
          border-color: rgba(255,0,170,0.2);
        }

        .schedule-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: 10px 14px;
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
        }

        .schedule-item-dot {
          width: 6px;
          height: 6px;
          background: var(--color-accent);
          border-radius: 50%;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .curso-detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}
