import { NextResponse } from 'next/server';
import { generatePasswordResetToken } from "@/utils/resetPassword";
import { sendPasswordResetEmail } from '@/utils/email';
import { findUserByEmail, saveResetTokenToDatabase } from '@/utils/findUserResetToken';



export async function POST(req, res) {
  try {
    const { email } = await req.json();

    // Check if user exists
    const user = await findUserByEmail(email);

    if (user) {
      // Generate reset token
      const resetToken = generatePasswordResetToken(user.id);

      // Save reset token to database
      await saveResetTokenToDatabase(user.id, resetToken);

      // Send password reset email
      await sendPasswordResetEmail(email, resetToken);
    }

    // Always return a success message, even if the email doesn't exist
    // This prevents email enumeration attacks
    return NextResponse.json({ message: 'Dacă există un cont cu acest email am trimis un email cu un link pentru resetarea parolei.' }, { status: 200 });
  } catch (error) {
    console.error('Eroare resetare parolă:', error);
    return NextResponse.json({ error: 'A apărut o eroare la procesarea cererii.' }, { status: 500 });
  }
}