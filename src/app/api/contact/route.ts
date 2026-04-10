import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com'
const SMTP_PORT = Number(process.env.SMTP_PORT || 465)
const SMTP_SECURE = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === 'true'
  : SMTP_PORT === 465

const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER || ''
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || ''

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'myynti@printmedia.fi'
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || SMTP_USER || 'no-reply@printmedia.fi'

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    if (!SMTP_USER || !SMTP_PASSWORD) {
      console.error('Contact form SMTP is not configured: missing SMTP_USER/SMTP_PASSWORD')
      return NextResponse.json(
        { error: 'Yhteydenottolomake ei ole konfiguroitu. Ota yhteys myynti@printmedia.fi.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, email, phone, company, subject, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nimi, sähköposti ja viesti ovat pakollisia kenttiä.' },
        { status: 400 }
      )
    }

    // Email content
    const mailOptions = {
      from: `"PrintMedia Yhteydenotto" <${CONTACT_FROM_EMAIL}>`,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Yhteydenotto: ${subject || 'Yleinen tiedustelu'}`,
      html: `
        <h2>Uusi yhteydenotto verkkosivuilta</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5; font-weight: bold;">Nimi:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5; font-weight: bold;">Sähköposti:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5; font-weight: bold;">Puhelin:</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="tel:${phone}">${phone}</a></td>
          </tr>
          ` : ''}
          ${company ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5; font-weight: bold;">Yritys:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${company}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5; font-weight: bold;">Aihe:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${subject || 'Yleinen tiedustelu'}</td>
          </tr>
        </table>
        <h3 style="margin-top: 20px;">Viesti:</h3>
        <div style="padding: 15px; background: #f9f9f9; border: 1px solid #ddd; white-space: pre-wrap;">${message}</div>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
        <p style="color: #666; font-size: 12px;">
          Tämä viesti lähetettiin PrintMedia PM Solutions Oy:n verkkosivujen yhteydenottolomakkeelta.
        </p>
      `,
      text: `
Uusi yhteydenotto verkkosivuilta

Nimi: ${name}
Sähköposti: ${email}
${phone ? `Puhelin: ${phone}` : ''}
${company ? `Yritys: ${company}` : ''}
Aihe: ${subject || 'Yleinen tiedustelu'}

Viesti:
${message}

---
Tämä viesti lähetettiin PrintMedia PM Solutions Oy:n verkkosivujen yhteydenottolomakkeelta.
      `,
    }

    const transporter = createTransporter()

    // Send primary message to sales inbox
    await transporter.sendMail(mailOptions)

    // Send confirmation email to the sender, but do not fail the whole request if this one fails
    const confirmationOptions = {
      from: `"PrintMedia PM Solutions Oy" <${CONTACT_FROM_EMAIL}>`,
      to: email,
      subject: 'Kiitos yhteydenotostasi - PrintMedia PM Solutions Oy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">Kiitos yhteydenotostasi!</h2>
          <p>Hei ${name},</p>
          <p>Olemme vastaanottaneet viestisi ja palaamme asiaan mahdollisimman pian, yleensä 1-2 arkipäivän kuluessa.</p>
          <p>Tässä kopio lähettämästäsi viestistä:</p>
          <div style="padding: 15px; background: #f5f5f5; border-left: 4px solid #1a365d; margin: 20px 0;">
            <strong>Aihe:</strong> ${subject || 'Yleinen tiedustelu'}<br><br>
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p>Ystävällisin terveisin,<br><strong>PrintMedia PM Solutions Oy</strong></p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />
          <p style="color: #666; font-size: 12px;">
            PrintMedia PM Solutions Oy<br>
            Koskueentie 7, 19700 Sysmä<br>
            Puh. 0440 875 025<br>
            <a href="mailto:myynti@printmedia.fi">myynti@printmedia.fi</a> | 
            <a href="https://www.printmedia.fi">www.printmedia.fi</a>
          </p>
        </div>
      `,
      text: `
Kiitos yhteydenotostasi!

Hei ${name},

Olemme vastaanottaneet viestisi ja palaamme asiaan mahdollisimman pian, yleensä 1-2 arkipäivän kuluessa.

Tässä kopio lähettämästäsi viestistä:

Aihe: ${subject || 'Yleinen tiedustelu'}

${message}

---
Ystävällisin terveisin,
PrintMedia PM Solutions Oy
Koskueentie 7, 19700 Sysmä
Puh. 0440 875 025
myynti@printmedia.fi | www.printmedia.fi
      `,
    }

    try {
      await transporter.sendMail(confirmationOptions)
    } catch (confirmationError) {
      console.error('Confirmation email sending error:', confirmationError)
    }

    return NextResponse.json({ success: true, message: 'Viesti lähetetty onnistuneesti!' })
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { error: 'Viestin lähetys epäonnistui. Yritä myöhemmin uudelleen.' },
      { status: 500 }
    )
  }
}
