import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Simple in-memory rate limiter (for production use Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 })
    return true
  }

  if (limit.count >= 5) return false
  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Por favor espera un momento.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { name, email, phone, instrument_interest, preferred_schedule, message } = body

    // Validation
    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 })
    }
    if (!phone || phone.replace(/\D/g, '').length < 7) {
      return NextResponse.json({ error: 'Teléfono inválido' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name: name.trim(),
          email: email?.trim() || null,
          phone: phone.trim(),
          instrument_interest: instrument_interest || null,
          preferred_schedule: preferred_schedule || null,
          message: message?.trim() || null,
          source: 'enrollment-form',
          status: 'new',
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        message: '¡Inscripción recibida! Te contactaremos pronto.',
        id: data.id,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Enroll API error:', err)
    return NextResponse.json(
      { error: 'Error al procesar la inscripción. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}
