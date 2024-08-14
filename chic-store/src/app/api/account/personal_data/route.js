import sqlite3 from 'sqlite3';
import { NextResponse } from 'next/server';
import openDatabase from '../../../../utils/openDB';




export const POST = async (req, res) => {
  console.log("personal_data POST request");
  let db;
  try {
    db = await openDatabase();

    const { email, first_name, last_name, phone } = await req.json();
    console.log("FIRST_NAME: ", first_name);
    console.log("LAST_NAME: ", last_name);
    console.log("PHONE: ", phone);

    const updateUserQuery = `UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE email = ?`;
    await new Promise((resolve, reject) => {
      db.run(updateUserQuery, [first_name, last_name, phone, email], (err) => {
        if (err) {
          console.error('Error updating user data in the database:', err.message);
          reject(err);
        } else {
          console.log(`User data updated for user with email: ${email}`);
          resolve();
        }
      });
    });

    // Return response
    return new Response(JSON.stringify({ message: "User data inserted successfully!" }), {
      status: 200,
    });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ message: 'Error', error: err.message }, { status: 500 });
  } finally {
    db.close();
  }
};







