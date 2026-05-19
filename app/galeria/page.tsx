import type { Metadata } from 'next'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Galería | Galilea Music Education',
  description: 'Explora nuestra galería fotográfica de clases, recitales y eventos de Galilea Music Education.',
  alternates: { canonical: '/galeria' },
}

// Gallery items using our generated images + placeholders for future real photos
const galleryItems = [
  { id: 1, src: '/images/piano-hero.png', alt: 'Clase de piano en Galilea Music Education', category: 'piano', title: 'Clase de Piano' },
  { id: 2, src: '/images/guitar-section.png', alt: 'Estudiante tocando guitarra', category: 'guitarra', title: 'Clase de Guitarra' },
  { id: 3, src: '/images/drums-section.png', alt: 'Clase de batería en el estudio', category: 'bateria', title: 'Clase de Batería' },
  { id: 4, src: '/images/music-bg.png', alt: 'Estudio de música de Galilea', category: 'general', title: 'Nuestro Estudio' },
  { id: 5, src: '/images/piano-hero.png', alt: 'Recital de piano', category: 'piano', title: 'Recital de Piano' },
  { id: 6, src: '/images/guitar-section.png', alt: 'Recital de guitarra', category: 'guitarra', title: 'Recital de Guitarra' },
]

const categories = ['Todos', 'Piano', 'Guitarra', 'Batería']

export default function GaleriaPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <section className="section">
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
              <span className="section-label" style={{ justifyContent: 'center' }}>Momentos</span>
              <h1 className="text-h2">
                Nuestra <span className="text-accent">galería</span>
              </h1>
              <p className="text-muted" style={{ marginTop: '16px', maxWidth: '480px', margin: '16px auto 0' }}>
                Fotos de nuestras clases, recitales y la comunidad musical de Galilea.
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="gallery-grid">
              {galleryItems.map((item, index) => (
                <figure
                  key={item.id}
                  className="gallery-item"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="gallery-image-wrapper">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="gallery-img"
                    />
                    <div className="gallery-overlay">
                      <div className="gallery-info">
                        <span className="gallery-category">{item.category}</span>
                        <figcaption className="gallery-title">{item.title}</figcaption>
                      </div>
                    </div>
                  </div>
                </figure>
              ))}
            </div>

            <div className="text-center" style={{ marginTop: 'var(--space-16)' }}>
              <p className="text-muted" style={{ marginBottom: '24px', fontSize: '14px' }}>
                📸 ¡Próximamente más fotos de nuestros eventos y clases!
              </p>
              <Link href="/inscribirse" className="btn btn-primary" id="gallery-enroll-btn">
                Sé parte de la historia
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }

        .gallery-item {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          aspect-ratio: 4/3;
          cursor: pointer;
          animation: fade-in-up 0.6s ease forwards;
          opacity: 0;
        }

        .gallery-item:nth-child(3n+1) { grid-row: span 1; }
        .gallery-item:nth-child(1) { aspect-ratio: 16/9; grid-column: span 2; }

        .gallery-image-wrapper {
          position: absolute;
          inset: 0;
        }

        .gallery-img {
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .gallery-item:hover .gallery-img {
          transform: scale(1.05);
        }

        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(17,17,17,0.9) 0%,
            transparent 60%
          );
          opacity: 0;
          transition: opacity var(--transition-normal);
          display: flex;
          align-items: flex-end;
          padding: var(--space-4);
        }

        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        .gallery-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .gallery-category {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-accent);
        }

        .gallery-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .gallery-item:nth-child(1) {
            grid-column: span 2;
          }
        }

        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: 1fr;
          }
          .gallery-item:nth-child(1) {
            grid-column: span 1;
          }
        }
      `}</style>
    </>
  )
}
