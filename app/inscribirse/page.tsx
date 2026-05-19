'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const instruments = [
  { value: 'piano', label: '🎹 Piano', teacher: 'Andrés Narváez' },
  { value: 'guitarra', label: '🎸 Guitarra', teacher: 'Danco Padilla' },
  { value: 'bateria', label: '🥁 Batería', teacher: 'José Ricardo' },
]

const schedules = [
  '9:00 AM — 10:00 AM',
  '10:00 AM — 11:00 AM',
  '3:00 PM — 4:00 PM',
  '4:00 PM — 5:00 PM',
  '5:00 PM — 6:00 PM',
]

interface FormState {
  name: string
  email: string
  phone: string
  instrument_interest: string
  preferred_schedule: string
  message: string
}

export default function InscribirsePage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    instrument_interest: '',
    preferred_schedule: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al enviar. Por favor intenta de nuevo.')
        return
      }

      setSuccess(true)
      setForm({ name: '', email: '', phone: '', instrument_interest: '', preferred_schedule: '', message: '' })
    } catch {
      setError('Error de conexión. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const selectedInstrument = instruments.find((i) => i.value === form.instrument_interest)

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <section className="enroll-section">
          <div className="enroll-bg" aria-hidden="true">
            <div className="enroll-bg-glow" />
          </div>

          <div className="container">
            <div className="enroll-grid">
              {/* Left: Info */}
              <div className="enroll-info">
                <span className="section-label">Inscripción</span>
                <h1 className="text-h2" style={{ marginBottom: '20px' }}>
                  Inicia tu aventura <span className="text-accent">musical</span>
                </h1>
                <p className="text-large text-muted" style={{ marginBottom: '40px' }}>
                  Completa el formulario y te contactaremos en menos de 24 horas para confirmar tu horario y comenzar.
                </p>

                <div className="enroll-features">
                  {[
                    { icon: '✓', text: 'Primera clase de exploración sin costo' },
                    { icon: '✓', text: 'Maestros con amplia experiencia' },
                    { icon: '✓', text: 'Grupos reducidos (máx. 8 estudiantes)' },
                    { icon: '✓', text: '$40.000 COP al mes' },
                    { icon: '✓', text: 'Lunes y Miércoles — 5 horarios disponibles' },
                  ].map((f) => (
                    <div key={f.text} className="enroll-feature">
                      <span className="feature-check">{f.icon}</span>
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>

                <div className="enroll-contact" style={{ marginTop: '40px' }}>
                  <p className="text-muted" style={{ fontSize: '14px', marginBottom: '12px' }}>
                    ¿Prefieres llamarnos directamente?
                  </p>
                  <a href="tel:+57123456789" className="btn btn-ghost" id="enroll-page-phone">
                    📞 123 456 789
                  </a>
                </div>
              </div>

              {/* Right: Form */}
              <div className="enroll-form-wrapper">
                {success ? (
                  <div className="enroll-success card card-glass">
                    <div className="success-icon">🎵</div>
                    <h2 className="text-h3" style={{ color: 'var(--color-accent)' }}>
                      ¡Inscripción recibida!
                    </h2>
                    <p className="text-muted" style={{ textAlign: 'center' }}>
                      Te contactaremos en menos de 24 horas al número que nos proporcionaste para confirmar tu horario y dar inicio a tu aventura musical.
                    </p>
                    <button
                      className="btn btn-outline"
                      onClick={() => setSuccess(false)}
                      style={{ marginTop: '8px' }}
                    >
                      Enviar otra inscripción
                    </button>
                  </div>
                ) : (
                  <form
                    className="enroll-form card card-glass"
                    onSubmit={handleSubmit}
                    noValidate
                    aria-label="Formulario de inscripción"
                  >
                    <h2 className="text-h4" style={{ marginBottom: '24px' }}>
                      Formulario de inscripción
                    </h2>

                    {error && (
                      <div className="form-error" role="alert">
                        <span>⚠️</span> {error}
                      </div>
                    )}

                    <div className="form-group">
                      <label className="label" htmlFor="enroll-name">Nombre completo *</label>
                      <input
                        id="enroll-name"
                        name="name"
                        type="text"
                        className="input"
                        placeholder="Tu nombre completo"
                        value={form.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="label" htmlFor="enroll-phone">Teléfono / WhatsApp *</label>
                        <input
                          id="enroll-phone"
                          name="phone"
                          type="tel"
                          className="input"
                          placeholder="314 688 0000"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          autoComplete="tel"
                        />
                      </div>
                      <div className="form-group">
                        <label className="label" htmlFor="enroll-email">Correo electrónico</label>
                        <input
                          id="enroll-email"
                          name="email"
                          type="email"
                          className="input"
                          placeholder="tu@correo.com"
                          value={form.email}
                          onChange={handleChange}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="label" htmlFor="enroll-instrument">Instrumento de interés</label>
                      <select
                        id="enroll-instrument"
                        name="instrument_interest"
                        className="select"
                        value={form.instrument_interest}
                        onChange={handleChange}
                      >
                        <option value="">Selecciona un instrumento</option>
                        {instruments.map((i) => (
                          <option key={i.value} value={i.value}>{i.label}</option>
                        ))}
                      </select>
                      {selectedInstrument && (
                        <p className="form-hint">
                          Maestro: <strong style={{ color: 'var(--color-accent)' }}>{selectedInstrument.teacher}</strong>
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="label" htmlFor="enroll-schedule">Horario preferido</label>
                      <select
                        id="enroll-schedule"
                        name="preferred_schedule"
                        className="select"
                        value={form.preferred_schedule}
                        onChange={handleChange}
                      >
                        <option value="">Selecciona un horario</option>
                        {schedules.map((s) => (
                          <option key={s} value={s}>{s} — Lunes y Miércoles</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="label" htmlFor="enroll-message">Mensaje (opcional)</label>
                      <textarea
                        id="enroll-message"
                        name="message"
                        className="input"
                        placeholder="Cuéntanos algo sobre tu experiencia musical o cualquier pregunta..."
                        value={form.message}
                        onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                        rows={4}
                        style={{ resize: 'vertical', minHeight: '100px' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-large"
                      style={{ width: '100%', justifyContent: 'center' }}
                      disabled={loading}
                      id="enroll-submit-btn"
                    >
                      {loading ? (
                        <>
                          <span className="btn-spinner" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar Inscripción
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="form-note">
                      * Campos obligatorios. Tus datos son confidenciales y solo se utilizarán para contactarte.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .enroll-section {
          position: relative;
          min-height: calc(100vh - var(--nav-height));
          padding: var(--space-20) 0;
        }

        .enroll-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .enroll-bg-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 50% 70% at 80% 50%, rgba(255,0,170,0.06) 0%, transparent 60%);
        }

        .enroll-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: var(--space-16);
          align-items: start;
        }

        .enroll-features {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .enroll-feature {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: 15px;
          color: var(--color-text-secondary);
        }

        .feature-check {
          width: 22px;
          height: 22px;
          background: var(--color-accent-subtle);
          border: 1px solid rgba(255,0,170,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: var(--color-accent);
          flex-shrink: 0;
          font-weight: 700;
        }

        .enroll-form,
        .enroll-success {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .enroll-success {
          align-items: center;
          text-align: center;
          padding: var(--space-12);
        }

        .success-icon {
          font-size: 60px;
          animation: float 3s ease-in-out infinite;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .form-hint {
          font-size: 13px;
          color: var(--color-text-muted);
          margin-top: 6px;
        }

        .form-error {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: 12px 16px;
          background: rgba(255, 50, 50, 0.08);
          border: 1px solid rgba(255, 50, 50, 0.2);
          border-radius: var(--radius-sm);
          font-size: 14px;
          color: #ff6666;
        }

        .form-note {
          font-size: 12px;
          color: var(--color-text-muted);
          text-align: center;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin-slow 0.8s linear infinite;
        }

        @media (max-width: 1024px) {
          .enroll-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}

