import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    return NextResponse.json({ success: true, message: 'Sesión cerrada con éxito.' })
  } catch (err: any) {
    console.error('Logout error:', err)
    return NextResponse.json(
      { error: 'Error en el servidor al intentar cerrar sesión.' },
      { status: 500 }
    )
  }
}
