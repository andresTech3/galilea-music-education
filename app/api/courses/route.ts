import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60 // ISR: revalidate every 60s

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables are missing!')
      return NextResponse.json({ error: 'Configuración de base de datos ausente' }, { status: 500 })
    }

    const supabase = await createClient()
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        instruments (id, name, slug, icon),
        teachers (id, name, specialty, experience_years)
      `)
      .eq('is_active', true)
      .order('level', { ascending: true })

    if (error) throw error

    return NextResponse.json(
      { courses, timestamp: new Date().toISOString() },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (err) {
    console.error('Courses API error:', err)
    return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 })
  }
}
