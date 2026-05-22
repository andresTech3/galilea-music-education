import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    const adminPassword = process.env.ADMIN_PASSWORD || 'galilea2026'

    if (password === adminPassword) {
      const cookieStore = await cookies()
      cookieStore.set('admin_session', 'galilea_admin_session_active_2026', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return NextResponse.json({ success: true, message: 'Autenticación exitosa.' })
    }

    return NextResponse.json(
      { error: 'Contraseña incorrecta. Inténtalo de nuevo.' },
      { status: 401 }
    )
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json(
      { error: 'Error en el servidor al intentar iniciar sesión.' },
      { status: 500 }
    )
  }
}
