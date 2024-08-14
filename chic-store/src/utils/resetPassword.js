// resetPassword.js
import jwt from 'jsonwebtoken';

export function generatePasswordResetToken(userId) {
  return jwt.sign(
    {
      userId,
      type: 'password_reset'
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  );
}