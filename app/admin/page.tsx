import { cookies } from 'next/headers'
import AdminLoginForm from '@/components/admin/AdminLoginForm'
import AdminDashboard from '@/components/admin/AdminDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel de Administración | Galilea Music Education',
  description: 'Panel de control administrativo para el seguimiento de estudiantes y envío de inscripciones.',
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  const isAuthenticated = session?.value === 'galilea_admin_session_active_2026'

  return (
    <div className="admin-wrapper bg-dark noise-bg" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background ambient glow */}
      <div 
        className="admin-glow-bg" 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50vw',
          height: '50vh',
          background: 'radial-gradient(ellipse 50% 50% at 90% 10%, rgba(255, 0, 170, 0.05) 0%, transparent 80%)',
          zIndex: 0,
          pointerEvents: 'none'
        }} 
      />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {isAuthenticated ? <AdminDashboard /> : <AdminLoginForm />}
      </div>
    </div>
  )
}
