import sqlite3 from 'sqlite3';
import { NextResponse } from 'next/server';
import openDatabase from '../../../../utils/openDB';


export const POST = async (req, res) => {
  console.log("delivery_address POST request");
  let db;
  try {
    db = await openDatabase();
    const { id, email } = await req.json();

    console.log("ID: ", id);
    console.log("EMAIL: ", email);


    const emailExists = await new Promise((resolve, reject) => {
      db.get(`SELECT COUNT(*) as count FROM users WHERE email = ? AND id != ?`, [email, id], (err, row) => {
        if (err) {
          console.error('Error checking email existence:', err.message);
          reject(err);
        } else {
          resolve(row.count > 0);
        }
      });
    });

    if (emailExists) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }


    const updateUserEmailQuery = `UPDATE users SET email = ? WHERE id = ?`;
    await new Promise((resolve, reject) => {
      db.run(updateUserEmailQuery, [email, id], (err) => {
        if (err) {
          console.error('Error updating email into the database:', err.message);
          reject(err);
        } else {
          console.log(`User data updated for user with email: ${email}`);
          resolve();
        }
      });
    });



    // Return authenticated response
    return new Response(JSON.stringify({ message: "User data updated successfully!" }), {
      status: 200,
    });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ message: 'Error', error: err.message }, { status: 500 });
  } finally {
    db.close();
  }
};
