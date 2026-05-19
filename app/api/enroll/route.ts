import { NextRequest, NextResponse } from 'next/server'
import { createReadOnlyClient } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'

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

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables are missing!')
      return NextResponse.json(
        { error: 'Error de configuración del servidor. Las credenciales de Supabase no están configuradas.' },
        { status: 500 }
      )
    }

    const supabase = createReadOnlyClient()
    const { error } = await supabase
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

    if (error) throw error

    // Send email notifications if configured
    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS

    if (emailUser && emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        })

        const instName = instrument_interest
          ? instrument_interest.charAt(0).toUpperCase() + instrument_interest.slice(1)
          : 'Instrumento por definir'

        // 1. Send confirmation to student if email is provided
        if (email && email.trim().length > 0) {
          const studentMailOptions = {
            from: `"Galilea Music Education" <${emailUser}>`,
            to: email.trim(),
            subject: '¡Bienvenido a Galilea Music Education! 🎵',
            html: `
              <div style="background-color: #111111; color: #ffffff; padding: 40px; font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; border: 1px solid rgba(255, 0, 170, 0.2);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <span style="font-size: 40px;">🎵</span>
                  <h1 style="color: #ff00aa; margin-top: 10px; font-size: 28px; letter-spacing: 1px; font-family: sans-serif;">GALILEA</h1>
                  <p style="font-size: 12px; text-transform: uppercase; color: #a0a0a0; letter-spacing: 3px; margin-top: -5px;">Music Education</p>
                </div>
                
                <h2 style="color: #ffffff; font-size: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; font-family: sans-serif;">¡Hola, ${name.trim()}!</h2>
                
                <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
                  Muchas gracias por tu interés en hacer música con nosotros. Hemos recibido tu formulario de inscripción para las clases de <strong>${instName}</strong>.
                </p>

                <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 20px; border-radius: 6px; margin: 25px 0;">
                  <h3 style="color: #ff00aa; margin-top: 0; font-size: 16px;">Resumen de tu solicitud:</h3>
                  <table style="width: 100%; border-collapse: collapse; color: #d0d0d0; font-size: 14px;">
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold; width: 140px;">Instrumento:</td>
                      <td style="padding: 6px 0;">${instName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">Horario preferido:</td>
                      <td style="padding: 6px 0;">${preferred_schedule || 'Por acordar'} (Lunes y Miércoles)</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">Precio del curso:</td>
                      <td style="padding: 6px 0; color: #ff00aa; font-weight: bold;">$40.000 COP / mes</td>
                    </tr>
                  </table>
                </div>

                <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
                  <strong>¿Qué sigue ahora?</strong><br>
                  Uno de nuestros maestros se pondrá en contacto contigo en las próximas 24 horas al número <strong>${phone.trim()}</strong> para confirmar la disponibilidad de tu cupo y afinar los detalles de tu primera clase.
                </p>

                <p style="color: #d0d0d0; line-height: 1.6; font-size: 15px;">
                  Si tienes dudas inmediatas, puedes escribirnos o llamarnos al teléfono de contacto del instituto: <strong>123 456 789</strong>.
                </p>

                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #808080; font-size: 12px;">
                  <p>📍 Barrio Piñalito</p>
                  <p>© 2026 Galilea Music Education. Todos los derechos reservados.</p>
                </div>
              </div>
            `
          }
          await transporter.sendMail(studentMailOptions)
        }

        // 2. Send notification to the boss
        const bossMailOptions = {
          from: `"Galilea Music System" <${emailUser}>`,
          to: emailUser,
          subject: `🚨 Nueva Inscripción: ${name.trim()} (${instName})`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2>¡Tienes un nuevo prospecto de estudiante!</h2>
              <p>Se ha registrado un nuevo formulario de inscripción en el sitio web:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr style="background: #f5f5f5;">
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 180px;">Nombre Completo:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${name.trim()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Teléfono / WhatsApp:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;"><a href="https://wa.me/${phone.trim().replace(/\s+/g, '')}">${phone.trim()}</a></td>
                </tr>
                <tr style="background: #f5f5f5;">
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Correo Electrónico:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${email?.trim() || 'No proporcionado'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Instrumento de Interés:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${instName}</td>
                </tr>
                <tr style="background: #f5f5f5;">
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Horario Seleccionado:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${preferred_schedule || 'Por acordar'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Mensaje adicional:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${message?.trim() || 'Ninguno'}</td>
                </tr>
              </table>
              
              <p style="margin-top: 20px; font-size: 13px; color: #666;">
                Puedes gestionar a tus estudiantes directamente desde el panel de control de Supabase.
              </p>
            </div>
          `
        }
        await transporter.sendMail(bossMailOptions)
      } catch (mailErr) {
        console.error('Failed to send notification emails:', mailErr)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: '¡Inscripción recibida! Te contactaremos pronto.',
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('Enroll API error:', err)
    return NextResponse.json(
      { 
        error: 'Error al procesar la inscripción. Intenta de nuevo.',
        debugError: err?.message || String(err),
        debugDetails: err
      },
      { status: 500 }
    )
  }
}
