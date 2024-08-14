//findUserResetToken.js
import openDatabase from './openDB';




export async function findUserByEmail(email) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
}


export async function saveResetTokenToDatabase(userId, resetToken) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    db.run('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetToken, Date.now() + 3600000, userId], // Token expires in 1 hour
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}


export async function findUserByResetToken(userId, resetToken) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ? AND reset_token = ? AND reset_token_expires > ?',
      [userId, resetToken, Date.now()],
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      }
    );
  });
}


export async function updateUserPassword(userId, newPassword) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    db.run('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [newPassword, userId],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}