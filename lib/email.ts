import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

export interface EmailPayload {
  to: string
  subject: string
  bookingId: string
  patientName: string
  phone: string
  service: string
  preferredDate: string
  preferredTime: string
  notes?: string
}

const sentEmailDir = path.join(process.cwd(), 'data', 'sent-emails')

function ensureSentEmailDir() {
  if (!fs.existsSync(sentEmailDir)) {
    fs.mkdirSync(sentEmailDir, { recursive: true })
  }
}

export function generateAppointmentEmailHtml(data: EmailPayload): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Appointment Confirmation - Dr. Anand's Dental Clinic</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .header { background-color: #0f172a; padding: 30px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.8; }
    .content { padding: 32px 24px; }
    .badge { display: inline-block; background-color: #dcfce7; color: #166534; font-weight: 600; font-size: 12px; padding: 6px 14px; border-radius: 20px; margin-bottom: 20px; }
    .greeting { font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 8px; }
    .intro { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .ref-no { font-family: monospace; font-size: 18px; font-weight: 700; color: #2563eb; }
    .info-table { width: 100%; margin-top: 16px; border-collapse: collapse; }
    .info-table td { padding: 8px 0; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
    .info-label { color: #64748b; font-weight: 500; width: 40%; }
    .info-val { color: #0f172a; font-weight: 600; }
    .clinic-box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 16px; border-radius: 6px; font-size: 13px; color: #1e40af; margin-bottom: 24px; }
    .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Dr. Anand's Dental Clinic</h1>
      <p>Ayya Koneru, Vizianagaram</p>
    </div>
    <div class="content">
      <div class="badge">✓ Appointment Confirmed</div>
      <div class="greeting">Hello ${data.patientName},</div>
      <p class="intro">
        Thank you for choosing Dr. Anand's Dental Clinic. Your appointment has been successfully confirmed. Below are your scheduled details:
      </p>

      <div class="card">
        <div style="font-size: 12px; color: #64748b;">Booking Reference ID</div>
        <div class="ref-no">${data.bookingId}</div>

        <table class="info-table">
          <tr>
            <td class="info-label">Patient Name:</td>
            <td class="info-val">${data.patientName}</td>
          </tr>
          <tr>
            <td class="info-label">Phone Number:</td>
            <td class="info-val">${data.phone}</td>
          </tr>
          <tr>
            <td class="info-label">Scheduled Date:</td>
            <td class="info-val">${data.preferredDate}</td>
          </tr>
          <tr>
            <td class="info-label">Time Slot:</td>
            <td class="info-val" style="color: #2563eb;">${data.preferredTime}</td>
          </tr>
          <tr>
            <td class="info-label">Treatment / Service:</td>
            <td class="info-val">${data.service}</td>
          </tr>
        </table>
      </div>

      <div class="clinic-box">
        <strong>📍 Clinic Location:</strong><br>
        Besides Gayatri Hospital, Ayyakoneru Gumchi Road, Vizianagaram<br>
        <strong>📞 Helpline:</strong> +91 891 255 0148 (Mon–Sun)
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
        <strong>Patient Instructions:</strong><br>
        • Please arrive 5-10 minutes prior to your time slot.<br>
        • Bring any previous dental records, X-rays, or prescriptions if applicable.<br>
        • For any query or rescheduling, contact our clinic helpline.
      </p>
    </div>
    <div class="footer">
      © 2026 Dr. Anand's Dental Clinic • Vizianagaram
    </div>
  </div>
</body>
</html>
  `
}

export async function sendAppointmentEmail(data: EmailPayload) {
  ensureSentEmailDir()
  const htmlContent = generateAppointmentEmailHtml(data)

  const timestamp = Date.now()
  const recordFile = path.join(sentEmailDir, `${data.bookingId}-${timestamp}.json`)

  let smtpSent = false
  let smtpError: string | null = null

  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
  const smtpPort = parseInt(process.env.SMTP_PORT || '465')
  const smtpSecure = process.env.SMTP_SECURE === 'false' ? false : true
  const smtpFrom = process.env.SMTP_FROM || `"Dr. Anand's Dental Clinic" <${smtpUser || 'no-reply@dranandsdental.com'}>`

  // Send via live Nodemailer SMTP if credentials are provided in .env / .env.local
  if (smtpUser && smtpPass && smtpUser !== 'your-email@gmail.com') {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      const mailOptions = {
        from: smtpFrom,
        to: data.to,
        subject: data.subject,
        html: htmlContent,
      }

      const info = await transporter.sendMail(mailOptions)
      console.log(`[SMTP Email Success] Message sent to ${data.to}: ${info.messageId}`)
      smtpSent = true
    } catch (err: any) {
      console.error('[SMTP Email Error]', err)
      smtpError = err.message || 'SMTP dispatch failed'
    }
  } else {
    console.log('[SMTP Warning] Live SMTP skipped because SMTP_USER and SMTP_PASS in .env.local contain default placeholder values.')
  }

  const emailRecord = {
    to: data.to,
    subject: data.subject,
    bookingId: data.bookingId,
    patientName: data.patientName,
    sentAt: new Date().toISOString(),
    smtpSent,
    smtpError,
    html: htmlContent,
  }

  fs.writeFileSync(recordFile, JSON.stringify(emailRecord, null, 2), 'utf8')

  return emailRecord
}
