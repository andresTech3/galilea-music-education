'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

interface Lead {
  id: string
  name: string
  email: string | null
  phone: string
  instrument_interest: string | null
  preferred_schedule: string | null
  message: string | null
  source: string
  status: string // 'new' | 'contacted' | 'enrolled' | 'cancelled'
  created_at: string
}

const INSTRUMENT_MAP: Record<string, { label: string; icon: string; teacher: string }> = {
  piano: { label: 'Piano', icon: '🎹', teacher: 'Andrés Narváez' },
  guitarra: { label: 'Guitarra', icon: '🎸', teacher: 'Danco Padilla' },
  bajo: { label: 'Bajo', icon: '🎸', teacher: 'Danco Padilla' },
  bateria: { label: 'Batería', icon: '🥁', teacher: 'José Ricardo' },
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nuevo', color: '#ff00aa', bg: 'rgba(255, 0, 170, 0.1)' },
  { value: 'contacted', label: 'Contactado', color: '#ffaa00', bg: 'rgba(255, 170, 0, 0.1)' },
  { value: 'enrolled', label: 'Inscrito', color: '#00c864', bg: 'rgba(0, 200, 100, 0.1)' },
  { value: 'cancelled', label: 'Cancelado', color: '#666666', bg: 'rgba(102, 102, 102, 0.1)' },
]

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [logoutLoading, setLogoutLoading] = useState(false)
  const router = useRouter()

  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [instrumentFilter, setInstrumentFilter] = useState('all')

  // Email Modal States
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [emailTo, setEmailTo] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [emailTemplate, setEmailTemplate] = useState('confirm')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailFeedback, setEmailFeedback] = useState({ type: '', message: '' })

  // Fetch leads on load
  const fetchLeads = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/leads')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al obtener leads.')
      }

      setLeads(data.leads || [])
    } catch (err: any) {
      setError(err.message || 'Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  // Logout handler
  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Error al cerrar sesión.')
      }
    } catch {
      alert('Error de conexión al cerrar sesión.')
    } finally {
      setLogoutLoading(false)
    }
  }

  // Update lead status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Error al actualizar el estado.')
        return
      }

      // Update local state
      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
      )
    } catch {
      alert('Error de red al actualizar estado.')
    }
  }

  // Delete lead
  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la inscripción de ${name}?`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Error al eliminar el registro.')
        return
      }

      // Remove from local state
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id))
    } catch {
      alert('Error de red al eliminar.')
    }
  }

  // Email template definitions
  const getTemplates = (lead: Lead) => {
    const name = lead.name.trim()
    const instKey = (lead.instrument_interest || '').toLowerCase()
    const instrument = INSTRUMENT_MAP[instKey]?.label || lead.instrument_interest || 'Instrumento por definir'
    const schedule = lead.preferred_schedule || 'Por acordar'
    const teacher = INSTRUMENT_MAP[instKey]?.teacher || 'El equipo de Galilea'

    return {
      confirm: {
        name: 'Confirmación de Horario',
        subject: `¡Hola ${name}! Coordinemos tu horario en Galilea Music Education 🎵`,
        body: `
<div style="background-color: #111111; color: #ffffff; padding: 40px; font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; border: 1px solid rgba(255, 0, 170, 0.2);">
  <div style="text-align: center; margin-bottom: 30px;">
    <span style="font-size: 40px;">🎵</span>
    <h1 style="color: #ff00aa; margin-top: 10px; font-size: 28px; letter-spacing: 1px; font-family: sans-serif; margin-bottom: 0;">GALILEA</h1>
    <p style="font-size: 12px; text-transform: uppercase; color: #a0a0a0; letter-spacing: 3px; margin-top: 2px;">Music Education</p>
  </div>
  
  <h2 style="color: #ffffff; font-size: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; font-family: sans-serif;">¡Hola, ${name}!</h2>
  
  <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
    Te saludamos de la Escuela de Música Galilea. Recibimos tu solicitud para las clases de <strong>${instrument}</strong>.
  </p>

  <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 20px; border-radius: 6px; margin: 25px 0;">
    <h3 style="color: #ff00aa; margin-top: 0; font-size: 16px;">Detalles de tu preinscripción:</h3>
    <table style="width: 100%; border-collapse: collapse; color: #d0d0d0; font-size: 14px;">
      <tr>
        <td style="padding: 6px 0; font-weight: bold; width: 140px;">Instrumento:</td>
        <td style="padding: 6px 0;">${instrument}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-weight: bold;">Horario Solicitado:</td>
        <td style="padding: 6px 0;">${schedule} (Lunes y Miércoles)</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-weight: bold;">Maestro Asignado:</td>
        <td style="padding: 6px 0;">${teacher}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-weight: bold;">Precio del curso:</td>
        <td style="padding: 6px 0; color: #ff00aa; font-weight: bold;">$40.000 COP / mes</td>
      </tr>
    </table>
  </div>

  <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
    Queremos confirmar tu asistencia para comenzar con tu primera <strong>clase de exploración gratuita</strong>.
  </p>

  <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
    Por favor responde a este correo o contáctanos directamente a nuestro número de WhatsApp para finalizar el registro de tu cupo.
  </p>

  <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
    <a href="https://wa.me/57${lead.phone.replace(/\D/g, '')}" style="background-color: #ff00aa; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block; font-size: 15px; box-shadow: 0 0 20px rgba(255,0,170,0.3);">Confirmar por WhatsApp</a>
  </div>

  <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #808080; font-size: 12px;">
    <p>📍 Barrio Piñalito | Lunes y Miércoles</p>
    <p>© 2026 Galilea Music Education. Todos los derechos reservados.</p>
  </div>
</div>
        `
      },
      trial: {
        name: 'Invitación a Clase de Prueba Gratis',
        subject: `¡Tu primera clase de ${instrument} es gratis! Agenda con el maestro ${teacher} 🎹`,
        body: `
<div style="background-color: #111111; color: #ffffff; padding: 40px; font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; border: 1px solid rgba(255, 0, 170, 0.2);">
  <div style="text-align: center; margin-bottom: 30px;">
    <span style="font-size: 40px;">🎵</span>
    <h1 style="color: #ff00aa; margin-top: 10px; font-size: 28px; letter-spacing: 1px; font-family: sans-serif; margin-bottom: 0;">GALILEA</h1>
    <p style="font-size: 12px; text-transform: uppercase; color: #a0a0a0; letter-spacing: 3px; margin-top: 2px;">Music Education</p>
  </div>
  
  <h2 style="color: #ffffff; font-size: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; font-family: sans-serif;">¡Hola, ${name}!</h2>
  
  <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
    ¡Es hora de despertar tu talento! Recibimos tu interés en aprender <strong>${instrument}</strong> en Galilea Music Education.
  </p>

  <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
    Te invitamos a tomar una <strong>clase de exploración sin costo</strong> con tu maestro <strong>${teacher}</strong> en tu horario preferido: <strong>${schedule}</strong>.
  </p>

  <div style="background-color: rgba(255, 0, 170, 0.05); border: 1px dashed rgba(255, 0, 170, 0.3); padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
    <p style="color: #ff00aa; font-weight: bold; margin: 0; font-size: 16px;">
      ✨ Primera Clase 100% Gratis y Sin Compromisos ✨
    </p>
    <p style="color: #d0d0d0; margin: 5px 0 0 0; font-size: 13px;">
      Conoce el instituto, a tu maestro y define tus metas musicales.
    </p>
  </div>

  <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
    Nuestros grupos son reducidos (máximo 8 alumnos) para darte una enseñanza de la mejor calidad. El valor mensual de la academia es de tan solo <strong>$40.000 COP al mes</strong>.
  </p>

  <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
    Responde directamente a este correo o por WhatsApp si quieres agendar tu clase este lunes. ¡Te esperamos!
  </p>

  <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #808080; font-size: 12px;">
    <p>📍 Barrio Piñalito</p>
    <p>© 2026 Galilea Music Education. Todos los derechos reservados.</p>
  </div>
</div>
        `
      },
      followup: {
        name: 'Seguimiento / Dudas',
        subject: `¿Tienes alguna duda sobre tus clases de ${instrument} en Galilea?`,
        body: `
<div style="background-color: #111111; color: #ffffff; padding: 40px; font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; border: 1px solid rgba(255, 0, 170, 0.2);">
  <div style="text-align: center; margin-bottom: 30px;">
    <span style="font-size: 40px;">🎵</span>
    <h1 style="color: #ff00aa; margin-top: 10px; font-size: 28px; letter-spacing: 1px; font-family: sans-serif; margin-bottom: 0;">GALILEA</h1>
    <p style="font-size: 12px; text-transform: uppercase; color: #a0a0a0; letter-spacing: 3px; margin-top: 2px;">Music Education</p>
  </div>
  
  <h2 style="color: #ffffff; font-size: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; font-family: sans-serif;">Hola, ${name}</h2>
  
  <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
    Te escribimos de Galilea Music Education. Vimos que te registraste para tomar clases de <strong>${instrument}</strong> en el horario <strong>${schedule}</strong>, pero no hemos logrado comunicarnos contigo.
  </p>

  <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
    ¿Tienes alguna duda sobre la academia? Te recordamos algunos beneficios:
  </p>

  <ul style="color: #d0d0d0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
    <li>Costo súper accesible: <strong>$40.000 COP al mes</strong>.</li>
    <li>Clases dos días por semana (Lunes y Miércoles).</li>
    <li>Maestros expertos y grupos de máximo 8 estudiantes.</li>
    <li>Primera clase de exploración completamente gratis.</li>
  </ul>

  <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
    Si aún tienes interés en aprender o tienes dudas, puedes responder directamente a este correo o escribirnos a nuestro WhatsApp. ¡Estamos listos para apoyarte!
  </p>

  <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #808080; font-size: 12px;">
    <p>📍 Barrio Piñalito</p>
    <p>© 2026 Galilea Music Education. Todos los derechos reservados.</p>
  </div>
</div>
        `
      }
    }
  }

  // Open email modal and pre-fill details
  const openEmailModal = (lead: Lead) => {
    setSelectedLead(lead)
    setEmailTo(lead.email || '')
    setEmailFeedback({ type: '', message: '' })

    const templates = getTemplates(lead)
    const defaultTemplate = templates.confirm
    setEmailTemplate('confirm')
    setEmailSubject(defaultTemplate.subject)
    setEmailBody(defaultTemplate.body)

    setEmailModalOpen(true)
  }

  // Switch template
  const handleTemplateChange = (templateKey: string) => {
    if (!selectedLead) return
    const templates = getTemplates(selectedLead)
    const selected = templates[templateKey as keyof typeof templates]
    if (selected) {
      setEmailTemplate(templateKey)
      setEmailSubject(selected.subject)
      setEmailBody(selected.body)
    }
  }

  // Send Email Handler
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead) return

    setSendingEmail(true)
    setEmailFeedback({ type: '', message: '' })

    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          to: emailTo,
          subject: emailSubject,
          html: emailBody,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setEmailFeedback({
          type: 'error',
          message: data.error || 'Error al enviar el correo.',
        })
        return
      }

      setEmailFeedback({
        type: 'success',
        message: '¡El correo electrónico fue enviado con éxito!',
      })

      // Update lead status in local state to 'contacted'
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === selectedLead.id ? { ...lead, status: 'contacted' } : lead
        )
      )

      // Close modal after a short delay
      setTimeout(() => {
        setEmailModalOpen(false)
        setSelectedLead(null)
      }, 1500)
    } catch {
      setEmailFeedback({
        type: 'error',
        message: 'Error de conexión. Intente de nuevo.',
      })
    } finally {
      setSendingEmail(false)
    }
  }

  // Metrics calculations
  const metrics = useMemo(() => {
    const total = leads.length
    const pending = leads.filter((l) => l.status === 'new').length
    const contacted = leads.filter((l) => l.status === 'contacted').length
    const enrolled = leads.filter((l) => l.status === 'enrolled').length
    const conversion = total > 0 ? Math.round((enrolled / total) * 100) : 0

    return { total, pending, contacted, enrolled, conversion }
  }, [leads])

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // 1. Text search
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        (lead.message || '').toLowerCase().includes(searchTerm.toLowerCase())

      // 2. Status filter
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter

      // 3. Instrument filter
      const matchesInstrument =
        instrumentFilter === 'all' ||
        (lead.instrument_interest || '').toLowerCase() === instrumentFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesInstrument
    })
  }, [leads, searchTerm, statusFilter, instrumentFilter])

  return (
    <div className="dashboard-container container-wide">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <div className="dashboard-logo">
            <span className="logo-icon">♪</span>
            <div>
              <span className="logo-brand">GALILEA</span>
              <span className="logo-tag">CONSOLA ADMINISTRATIVA</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-sm logout-btn"
          disabled={logoutLoading}
        >
          {logoutLoading ? 'Cerrando...' : 'Cerrar Sesión'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </button>
      </header>

      {/* Metrics Grid */}
      <section className="metrics-grid">
        <div className="metric-card card card-glass">
          <span className="metric-label">Total Inscritos</span>
          <span className="metric-value">{metrics.total}</span>
          <div className="metric-glow" style={{ background: 'rgba(255, 255, 255, 0.05)' }} />
        </div>
        <div className="metric-card card card-glass">
          <span className="metric-label">Nuevos (Pendientes)</span>
          <span className="metric-value text-accent" style={{ color: '#ff00aa' }}>
            {metrics.pending}
          </span>
          <div className="metric-glow" style={{ background: 'rgba(255, 0, 170, 0.1)' }} />
        </div>
        <div className="metric-card card card-glass">
          <span className="metric-label">Contactados</span>
          <span className="metric-value" style={{ color: '#ffaa00' }}>
            {metrics.contacted}
          </span>
          <div className="metric-glow" style={{ background: 'rgba(255, 170, 0, 0.1)' }} />
        </div>
        <div className="metric-card card card-glass">
          <span className="metric-label">Matriculados</span>
          <span className="metric-value" style={{ color: '#00c864' }}>
            {metrics.enrolled}
          </span>
          <div className="metric-glow" style={{ background: 'rgba(0, 200, 100, 0.1)' }} />
        </div>
        <div className="metric-card card card-glass">
          <span className="metric-label">Tasa Conversión</span>
          <span className="metric-value" style={{ color: 'var(--color-text-primary)' }}>
            {metrics.conversion}%
          </span>
          <div className="metric-glow" style={{ background: 'rgba(255, 255, 255, 0.05)' }} />
        </div>
      </section>

      {/* Filters & Control bar */}
      <section className="filters-card card card-glass">
        <div className="filters-grid">
          {/* Search bar */}
          <div className="form-group search-group">
            <label className="label">Buscar estudiante</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="input"
                placeholder="Buscar por nombre, correo o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '42px' }}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Instrument Filter */}
          <div className="form-group">
            <label className="label">Instrumento</label>
            <select
              className="select"
              value={instrumentFilter}
              onChange={(e) => setInstrumentFilter(e.target.value)}
            >
              <option value="all">Todos los instrumentos</option>
              <option value="piano">🎹 Piano</option>
              <option value="guitarra">🎸 Guitarra</option>
              <option value="bajo">🎸 Bajo</option>
              <option value="bateria">🥁 Batería</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="form-group">
            <label className="label">Estado</label>
            <select
              className="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <div className="form-group" style={{ justifyContent: 'flex-end', height: '100%' }}>
            <button
              onClick={fetchLeads}
              className="btn btn-ghost"
              style={{ width: '100%', padding: '13px 20px' }}
              title="Actualizar datos"
            >
              🔄 Recargar
            </button>
          </div>
        </div>
      </section>

      {/* Leads Table Card */}
      <main className="table-wrapper card card-glass">
        {loading ? (
          <div className="loading-skeleton-wrapper">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton skeleton-row" />
            ))}
          </div>
        ) : error ? (
          <div className="dashboard-error">
            <span>⚠️</span>
            <p>{error}</p>
            <button className="btn btn-outline" onClick={fetchLeads}>
              Reintentar
            </button>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="empty-state">
            <span>🎵</span>
            <h3>No se encontraron inscripciones</h3>
            <p className="text-muted">
              Intenta cambiar los filtros o el término de búsqueda actual.
            </p>
          </div>
        ) : (
          <div className="responsive-table-container">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Estudiante</th>
                  <th>Contacto</th>
                  <th>Instrumento</th>
                  <th>Horario</th>
                  <th>Mensaje</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const instKey = (lead.instrument_interest || '').toLowerCase()
                  const instDetails = INSTRUMENT_MAP[instKey] || { label: lead.instrument_interest, icon: '🎵' }
                  const dateStr = new Date(lead.created_at).toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })

                  // Prefilled WhatsApp message
                  const waText = encodeURIComponent(
                    `¡Hola ${lead.name}! Te saludamos de Galilea Music Education. Vimos tu formulario de inscripción para las clases de ${instDetails.label} en el horario de ${lead.preferred_schedule || 'Lunes y Miércoles'}. ¿Cómo estás?`
                  )
                  const cleanPhone = lead.phone.replace(/\D/g, '')

                  return (
                    <tr key={lead.id} className="lead-row">
                      <td className="date-cell">
                        <span className="date-text">{dateStr}</span>
                      </td>
                      <td className="student-cell">
                        <div className="student-name">{lead.name}</div>
                        <div className="source-badge">web-inscribirse</div>
                      </td>
                      <td className="contact-cell">
                        <div className="contact-item">
                          <span>📞</span>
                          <a href={`tel:${lead.phone}`} className="contact-link">
                            {lead.phone}
                          </a>
                        </div>
                        {lead.email && (
                          <div className="contact-item">
                            <span>✉️</span>
                            <a href={`mailto:${lead.email}`} className="contact-link">
                              {lead.email}
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="instrument-cell">
                        <span className="inst-badge">
                          <span>{instDetails.icon}</span>
                          <span>{instDetails.label}</span>
                        </span>
                      </td>
                      <td className="schedule-cell">
                        <div className="schedule-text">{lead.preferred_schedule || 'Por acordar'}</div>
                        <div className="schedule-days">Lunes y Miércoles</div>
                      </td>
                      <td className="message-cell">
                        {lead.message ? (
                          <div className="message-bubble" title={lead.message}>
                            {lead.message.length > 50 ? `${lead.message.slice(0, 50)}...` : lead.message}
                          </div>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '13px' }}>
                            Ninguno
                          </span>
                        )}
                      </td>
                      <td className="status-cell">
                        <select
                          className="status-dropdown"
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          style={{
                            color: STATUS_OPTIONS.find((o) => o.value === lead.status)?.color || 'white',
                            borderColor: STATUS_OPTIONS.find((o) => o.value === lead.status)?.color || 'rgba(255,255,255,0.1)',
                            background: STATUS_OPTIONS.find((o) => o.value === lead.status)?.bg || 'rgba(255,255,255,0.03)'
                          }}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} style={{ background: '#1a1a1a', color: 'white' }}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="actions-cell">
                        <div className="actions-container">
                          {/* WhatsApp Action */}
                          <a
                            href={`https://wa.me/57${cleanPhone}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn wa-btn"
                            title="Chatear por WhatsApp"
                          >
                            💬
                          </a>

                          {/* Email Action */}
                          <button
                            onClick={() => openEmailModal(lead)}
                            className="action-btn email-btn"
                            disabled={!lead.email}
                            style={{ opacity: lead.email ? 1 : 0.4 }}
                            title={lead.email ? 'Enviar Gmail Personalizado' : 'Sin correo electrónico'}
                          >
                            ✉️
                          </button>

                          {/* Delete Action */}
                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                            className="action-btn delete-btn"
                            title="Eliminar registro"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Gmail Modal */}
      {emailModalOpen && selectedLead && (
        <div className="modal-backdrop">
          <div className="modal-card card card-glass animate-scale-in">
            <header className="modal-header">
              <h2 className="text-h4">Enviar Gmail Personalizado</h2>
              <button className="close-modal-btn" onClick={() => setEmailModalOpen(false)}>
                ✕
              </button>
            </header>

            <form onSubmit={handleSendEmail} className="modal-form">
              {emailFeedback.message && (
                <div
                  className={`modal-feedback ${
                    emailFeedback.type === 'success' ? 'feedback-success' : 'feedback-error'
                  }`}
                >
                  <span>{emailFeedback.type === 'success' ? '✅' : '⚠️'}</span>
                  <span>{emailFeedback.message}</span>
                </div>
              )}

              {/* Template selector */}
              <div className="form-group">
                <label className="label">Selecciona una Plantilla</label>
                <select
                  className="select"
                  value={emailTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                >
                  <option value="confirm">📋 Confirmación de Horario (Recomendado)</option>
                  <option value="trial">✨ Invitación a Clase Gratis</option>
                  <option value="followup">🔔 Seguimiento de Preinscripción</option>
                </select>
              </div>

              {/* Recipient */}
              <div className="form-group">
                <label className="label">Destinatario</label>
                <input
                  type="email"
                  className="input"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  required
                />
              </div>

              {/* Subject */}
              <div className="form-group">
                <label className="label">Asunto del Correo</label>
                <input
                  type="text"
                  className="input"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  required
                />
              </div>

              {/* Body (HTML / Textarea) */}
              <div className="form-group">
                <label className="label">Contenido HTML del Correo</label>
                <textarea
                  className="input body-textarea"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={10}
                  required
                  style={{ fontFamily: 'monospace', fontSize: '13px' }}
                />
              </div>

              {/* Live Preview (Wow Factor) */}
              <div className="form-group">
                <label className="label">Vista Previa del Diseño</label>
                <div className="html-preview-container">
                  <div dangerouslySetInnerHTML={{ __html: emailBody }} />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="btn btn-ghost"
                  disabled={sendingEmail}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={sendingEmail}>
                  {sendingEmail ? (
                    <>
                      <span className="spinner-small" />
                      Enviando por Gmail...
                    </>
                  ) : (
                    <>
                      Enviar Correo
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Styling */}
      <style>{`
        .dashboard-container {
          padding-top: var(--space-8);
          padding-bottom: var(--space-16);
          min-height: 100vh;
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-8);
        }

        .dashboard-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-brand {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--color-text-primary);
          display: block;
          line-height: 1.1;
        }

        .logo-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--color-accent);
          letter-spacing: 0.16em;
          display: block;
        }

        .logout-btn {
          border-color: rgba(255, 255, 255, 0.08);
        }

        /* Metrics grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-8);
        }

        .metric-card {
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--color-border);
        }

        .metric-label {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-secondary);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .metric-value {
          font-family: var(--font-display);
          font-size: 36px;
          font-weight: 700;
          line-height: 1;
        }

        .metric-glow {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          filter: blur(25px);
          pointer-events: none;
          z-index: 0;
        }

        /* Filters */
        .filters-card {
          padding: var(--space-5);
          margin-bottom: var(--space-6);
          background: rgba(255, 255, 255, 0.02);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 120px;
          gap: var(--space-4);
          align-items: flex-end;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          opacity: 0.6;
        }

        /* Table CSS */
        .table-wrapper {
          padding: 0;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--color-border);
        }

        .responsive-table-container {
          overflow-x: auto;
          width: 100%;
        }

        .leads-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }

        .leads-table th {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 18px 24px;
          border-bottom: 1px solid var(--color-border);
          background: rgba(0, 0, 0, 0.2);
        }

        .lead-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: background-color var(--transition-fast);
        }

        .lead-row:hover {
          background-color: rgba(255, 255, 255, 0.01);
        }

        .leads-table td {
          padding: 16px 24px;
          vertical-align: middle;
        }

        .date-text {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-text-muted);
        }

        .student-name {
          font-weight: 600;
          color: white;
          font-size: 15px;
        }

        .source-badge {
          display: inline-block;
          font-size: 10px;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          background: rgba(255, 255, 255, 0.04);
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 4px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          margin-top: 2px;
        }

        .contact-link {
          color: var(--color-text-secondary);
          transition: color var(--transition-fast);
        }

        .contact-link:hover {
          color: var(--color-accent);
          text-decoration: underline;
        }

        .inst-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--color-border);
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: 500;
        }

        .schedule-text {
          font-weight: 500;
          color: var(--color-text-primary);
        }

        .schedule-days {
          font-size: 11px;
          color: var(--color-text-muted);
          font-family: var(--font-mono);
        }

        .message-bubble {
          max-width: 200px;
          font-size: 13px;
          color: var(--color-text-secondary);
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          padding: 8px 12px;
          border-radius: 6px;
          cursor: help;
        }

        .status-dropdown {
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border: 1px solid;
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .actions-container {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          font-size: 14px;
          transition: all var(--transition-fast);
        }

        .action-btn:hover {
          transform: translateY(-1px);
        }

        .wa-btn:hover {
          background: rgba(37, 211, 102, 0.1);
          border-color: rgba(37, 211, 102, 0.4);
          box-shadow: 0 0 10px rgba(37, 211, 102, 0.1);
        }

        .email-btn:hover {
          background: rgba(255, 0, 170, 0.1);
          border-color: rgba(255, 0, 170, 0.4);
          box-shadow: 0 0 10px rgba(255, 0, 170, 0.1);
        }

        .delete-btn:hover {
          background: rgba(255, 70, 70, 0.1);
          border-color: rgba(255, 70, 70, 0.4);
          box-shadow: 0 0 10px rgba(255, 70, 70, 0.1);
        }

        /* Loading Skeletons */
        .loading-skeleton-wrapper {
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .skeleton-row {
          height: 52px;
          width: 100%;
        }

        .empty-state, .dashboard-error {
          padding: 80px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-4);
        }

        .empty-state span, .dashboard-error span {
          font-size: 48px;
        }

        /* Modal styling */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--z-modal);
          padding: var(--space-4);
          overflow-y: auto;
        }

        .modal-card {
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8), 0 0 80px rgba(255, 0, 170, 0.15);
          border: 1px solid rgba(255, 0, 170, 0.2);
          animation: scale-in 0.3s ease;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-5);
        }

        .close-modal-btn {
          font-size: 20px;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .close-modal-btn:hover {
          opacity: 1;
          color: var(--color-accent);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .body-textarea {
          resize: vertical;
          min-height: 150px;
        }

        .html-preview-container {
          background: #1e1e1e;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 10px;
          max-height: 300px;
          overflow-y: auto;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-4);
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-border);
        }

        .modal-feedback {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: 14px;
        }

        .feedback-success {
          background: rgba(0, 200, 100, 0.08);
          border: 1px solid rgba(0, 200, 100, 0.2);
          color: #00c864;
        }

        .feedback-error {
          background: rgba(255, 50, 50, 0.08);
          border: 1px solid rgba(255, 50, 50, 0.2);
          color: #ff6666;
        }

        .spinner-small {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin-slow 0.8s linear infinite;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .metrics-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .filters-grid {
            grid-template-columns: 1fr 1fr;
          }
          .search-group {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: 1fr 1fr;
          }
          .filters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
