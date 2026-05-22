import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import nodemailer from 'nodemailer'
import { createAdminClient } from '@/lib/supabase/admin'

// Helper to check if admin is authenticated
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === 'galilea_admin_session_active_2026'
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado. Inicie sesión.' }, { status: 401 })
  }

  try {
    const { leadId, to, subject, html } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos: to, subject o html.' },
        { status: 400 }
      )
    }

    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS

    if (!emailUser || !emailPass) {
      return NextResponse.json(
        {
          error:
            'Servidor de correo no configurado. Por favor configure EMAIL_USER y EMAIL_PASS en el archivo .env.local.',
        },
        { status: 500 }
      )
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })

    const mailOptions = {
      from: `"Galilea Music Education" <${emailUser}>`,
      to: to.trim(),
      subject: subject.trim(),
      html: html,
    }

    // Send the email
    await transporter.sendMail(mailOptions)

    // If leadId is provided, update the lead's status to 'contacted'
    if (leadId) {
      try {
        const supabase = createAdminClient()
        await supabase
          .from('leads')
          .update({ status: 'contacted' })
          .eq('id', leadId)
      } catch (dbErr) {
        console.error('Failed to update lead status after sending email:', dbErr)
        // We still return success: true because the email WAS sent successfully
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Correo electrónico enviado con éxito y estado actualizado.',
    })
  } catch (err: any) {
    console.error('Send email admin API error:', err)
    return NextResponse.json(
      { error: 'Error al enviar el correo electrónico.', details: err.message },
      { status: 500 }
    )
  }
}
