import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nosotros | Galilea Music Education',
  description:
    'Conoce a los maestros y la historia de Galilea Music Education. Instituto de música con maestros especializados en Piano, Guitarra y Batería en el Barrio Piñalito.',
  alternates: { canonical: '/nosotros' },
}

const teachers = [
  {
    name: 'Andrés Narváez',
    instrument: 'Piano',
    icon: '🎹',
    specialty: 'Piano Clásico, Jazz, Pop',
    experience: 5,
    bio: 'Músico y pedagogo con amplia experiencia en la enseñanza del piano. Especialista en música clásica, pop y jazz. Forma músicos integrales con bases sólidas en teoría y práctica. Su metodología personalizada se adapta al ritmo de aprendizaje de cada estudiante.',
    passion: '"La música es el lenguaje del alma. Mi misión es enseñarte a hablar ese idioma."',
  },
  {
    name: 'Danco Padilla',
    instrument: 'Guitarra',
    icon: '🎸',
    specialty: 'Guitarra Acústica y Eléctrica, Fingerpicking',
    experience: 5,
    bio: 'Guitarrista profesional con dominio en múltiples estilos musicales. Especialista en guitarra acústica, eléctrica y técnica fingerpicking. Apasionado por transmitir el amor a la música. Con más de una década de experiencia formando guitarristas de todos los niveles.',
    passion: '"Cada acorde que aprendes es una puerta que se abre hacia un mundo nuevo de posibilidades."',
  },
  {
    name: 'José Ricardo',
    instrument: 'Batería',
    icon: '🥁',
    specialty: 'Batería Rock, Ritmos Latinoamericanos',
    experience: 12,
    bio: 'Baterista con experiencia en bandas de rock, cumbia y salsa. Especialista en ritmos latinoamericanos y técnicas modernas de batería. Desarrolla el ritmo interno y la coordinación de cada estudiante con una metodología dinámica y motivadora.',
    passion: '"El ritmo está en todos. Mi trabajo es sacarlo de ti y convertirlo en música."',
  },
]

export default function NosotrosPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        {/* Hero */}
        <section className="nosotros-hero">
          <div className="nosotros-hero-bg" aria-hidden="true" />
          <div className="container">
            <div className="nosotros-hero-content">
              <span className="section-label">Sobre Nosotros</span>
              <h1 className="text-h2" style={{ marginBottom: '20px' }}>
                Donde la <span className="text-accent">música</span> cobra vida
              </h1>
              <p className="text-large text-muted" style={{ maxWidth: '600px' }}>
                Galilea Music Education es un instituto de música ubicado en el Barrio Piñalito, 
                dedicado a formar músicos apasionados con bases sólidas y amor por el arte.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="section">
          <div className="container">
            <div className="mission-grid">
              <div className="mission-card card card-glass">
                <span style={{ fontSize: '40px', marginBottom: '16px', display: 'block' }}>🎯</span>
                <h2 className="text-h4" style={{ marginBottom: '12px' }}>Nuestra Misión</h2>
                <p className="text-muted">
                  Brindar educación musical de alta calidad, accesible para toda la comunidad, 
                  formando músicos completos con bases técnicas y un amor genuino por la música.
                </p>
              </div>
              <div className="mission-card card card-glass">
                <span style={{ fontSize: '40px', marginBottom: '16px', display: 'block' }}>👁</span>
                <h2 className="text-h4" style={{ marginBottom: '12px' }}>Nuestra Visión</h2>
                <p className="text-muted">
                  Ser el instituto de música más reconocido de la región, referente de excelencia 
                  pedagógica y formación artística integral, transformando vidas a través de la música.
                </p>
              </div>
              <div className="mission-card card card-glass">
                <span style={{ fontSize: '40px', marginBottom: '16px', display: 'block' }}>💎</span>
                <h2 className="text-h4" style={{ marginBottom: '12px' }}>Nuestros Valores</h2>
                <p className="text-muted">
                  Excelencia, pasión, disciplina y comunidad. Creemos que la música es una herramienta 
                  de transformación personal y social para todos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Teachers */}
        <section className="section" style={{ background: 'var(--color-bg-1)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
              <span className="section-label" style={{ justifyContent: 'center' }}>El equipo</span>
              <h2 className="text-h2">
                Nuestros <span className="text-accent">maestros</span>
              </h2>
            </div>

            <div className="teachers-grid">
              {teachers.map((teacher) => (
                <article key={teacher.name} className="teacher-card card">
                  <div className="teacher-header">
                    <div className="teacher-avatar">
                      <span className="teacher-icon">{teacher.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-h4" style={{ marginBottom: '4px' }}>{teacher.name}</h3>
                      <p className="text-accent" style={{ fontSize: '14px', fontWeight: 600 }}>
                        Maestro de {teacher.instrument}
                      </p>
                    </div>
                  </div>

                  <div className="teacher-specialty">
                    <span className="badge badge-accent">{teacher.specialty}</span>
                    <span className="badge badge-outline">{teacher.experience}+ años</span>
                  </div>

                  <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                    {teacher.bio}
                  </p>

                  <blockquote className="teacher-quote">
                    <em style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                      {teacher.passion}
                    </em>
                  </blockquote>

                  <Link
                    href={`/cursos/${teacher.instrument.toLowerCase().replace('ía', 'ia')}`}
                    className="btn btn-outline btn-sm"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Ver cursos de {teacher.instrument}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="container">
            <div className="text-center">
              <h2 className="text-h2" style={{ marginBottom: '20px' }}>
                ¿Listo para aprender con los <span className="text-accent">mejores</span>?
              </h2>
              <p className="text-large text-muted" style={{ marginBottom: '40px' }}>
                Únete a Galilea Music Education y empieza tu camino musical hoy.
              </p>
              <Link href="/inscribirse" className="btn btn-primary btn-large" id="nosotros-enroll-btn">
                Inscríbete Ahora
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .nosotros-hero {
          position: relative;
          padding: var(--space-20) 0;
          overflow: hidden;
        }

        .nosotros-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255,0,170,0.06) 0%, transparent 70%);
        }

        .nosotros-hero-content {
          position: relative;
          z-index: 1;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }

        .mission-card {
          display: flex;
          flex-direction: column;
        }

        .teachers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }

        .teacher-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .teacher-header {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .teacher-avatar {
          width: 70px;
          height: 70px;
          background: var(--color-accent-subtle);
          border: 2px solid rgba(255,0,170,0.2);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .teacher-icon {
          font-size: 32px;
        }

        .teacher-specialty {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .teacher-quote {
          padding: var(--space-4);
          border-left: 3px solid var(--color-accent);
          background: var(--color-accent-subtle);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }

        @media (max-width: 1024px) {
          .mission-grid,
          .teachers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}

