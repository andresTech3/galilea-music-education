import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página no encontrada | Galilea Music Education',
  description: 'La página que buscas no existe. Vuelve al inicio de Galilea Music Education.',
}

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '24px',
      textAlign: 'center',
      padding: '40px',
      background: 'var(--color-bg)',
    }}>
      <div style={{ fontSize: '80px', animation: 'float 3s ease-in-out infinite' }}>🎵</div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(60px, 10vw, 100px)',
        fontWeight: 700,
        color: 'var(--color-accent)',
        lineHeight: 1,
      }}>404</h1>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(24px, 4vw, 40px)',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
      }}>Nota perdida...</h2>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', lineHeight: 1.6 }}>
        Esta página no existe. Pero tu aventura musical aún no ha terminado.
      </p>
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '14px 28px',
          background: 'var(--color-accent)',
          color: 'white',
          borderRadius: '4px',
          fontWeight: 600,
          fontSize: '15px',
          textDecoration: 'none',
          transition: 'all 300ms ease',
        }}
      >
        ← Volver al inicio
      </a>
    </main>
  )
}
