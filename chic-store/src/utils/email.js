// email.js
import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(email, resetToken) {
  // Configure your email transport
  const transporter = nodemailer.createTransport({
    // Your email service configuration
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Resetare Parolă',
    html: `
    <!DOCTYPE html>
    <html lang="ro">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resetare Parolă</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; text-align: center;">
        <h1 style="color: #FFD700;">Resetare Parolă</h1>
      </div>
      <div style="margin-top: 20px;">
        <p>Bună,</p>
        <p>Ați cerut resetarea parolei pentru contul dumneavoastră. Pentru a vă reseta parola, vă rugăm să dați click pe butonul de mai jos:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style=" cursor: pointer; background-color: #FFD700; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Resetează Parola</a>
        </div>
        <p>Dacă butonul de mai sus nu funcționează, puteți copia și lipi următorul link în browser-ul dumneavoastră:</p>
        <p style="word-break: break-all; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${resetUrl}</p>
        <p>Dacă nu ați cerut această resetare, vă rugăm să ignorați acest email sau să contactați echipa noastră de suport dacă aveți întrebări.</p>
        <p>Mulțumim,<br>Echipa Noastră</p>
      </div>
      <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
        <p>Acest email a fost trimis automat. Vă rugăm să nu răspundeți la acest mesaj.</p>
      </div>
    </body>
    </html>  
    `,
  });
}