'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Contraseña incorrecta.')
        setLoading(false)
        return
      }

      // Success! Refresh the page to trigger Server Component check which will now render the dashboard
      router.refresh()
    } catch (err) {
      setError('Error al conectar con el servidor. Intente de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card card card-glass animate-scale-in">
        <div className="login-logo">
          <span className="logo-icon">♪</span>
          <h1 className="logo-title">GALILEA</h1>
          <span className="logo-subtitle">PORTAL ADMINISTRATIVO</span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="login-form">
          <p className="login-instructions">
            Por favor, ingresa la contraseña de administrador para gestionar las inscripciones y enviar correos de bienvenida.
          </p>

          {error && (
            <div className="login-error animate-fade-in" role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="label" htmlFor="admin-password">
              Contraseña de Acceso
            </label>
            <input
              id="admin-password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Iniciando sesión...
              </>
            ) : (
              <>
                Entrar al Panel
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: var(--space-4);
          z-index: 1;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          padding: var(--space-10) var(--space-8);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6), 0 0 80px rgba(255, 0, 170, 0.05);
          border: 1px solid rgba(255, 0, 170, 0.15);
        }

        .login-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .logo-icon {
          font-size: 48px;
          color: var(--color-accent);
          filter: drop-shadow(0 0 12px var(--color-accent));
          line-height: 1;
          margin-bottom: var(--space-2);
          animation: float 3s ease-in-out infinite;
        }

        .logo-title {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--color-text-primary);
          line-height: 1;
        }

        .logo-subtitle {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-accent);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-top: 6px;
        }

        .login-instructions {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.6;
          text-align: center;
          margin-bottom: var(--space-6);
        }

        .login-form {
          display: flex;
          flex-direction: column;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: 12px 16px;
          background: rgba(255, 50, 50, 0.08);
          border: 1px solid rgba(255, 50, 50, 0.2);
          border-radius: var(--radius-sm);
          font-size: 14px;
          color: #ff6666;
          margin-bottom: var(--space-5);
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin-slow 0.8s linear infinite;
        }
      `}</style>
    </div>
  )
}
