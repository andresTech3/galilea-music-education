import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

// Helper to check if admin is authenticated
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === 'galilea_admin_session_active_2026'
}

// GET: Fetch all leads
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado. Inicie sesión.' }, { status: 401 })
  }

  try {
    const supabase = createAdminClient()
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ leads })
  } catch (err: any) {
    console.error('Fetch leads admin error:', err)
    return NextResponse.json(
      { error: 'Error al obtener las inscripciones.', details: err.message },
      { status: 500 }
    )
  }
}

// PUT: Update lead status
export async function PUT(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado. Inicie sesión.' }, { status: 401 })
  }

  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos: id o status.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Estado actualizado correctamente.', lead: data[0] })
  } catch (err: any) {
    console.error('Update lead admin error:', err)
    return NextResponse.json(
      { error: 'Error al actualizar la inscripción.', details: err.message },
      { status: 500 }
    )
  }
}

// DELETE: Delete lead
export async function DELETE(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado. Inicie sesión.' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    let id = searchParams.get('id')

    if (!id) {
      try {
        const body = await request.json()
        id = body.id
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: 'Falta el parámetro requerido: id.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Inscripción eliminada correctamente.' })
  } catch (err: any) {
    console.error('Delete lead admin error:', err)
    return NextResponse.json(
      { error: 'Error al eliminar la inscripción.', details: err.message },
      { status: 500 }
    )
  }
}
