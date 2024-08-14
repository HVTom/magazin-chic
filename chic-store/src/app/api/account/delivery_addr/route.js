import sqlite3 from 'sqlite3';
import { NextResponse } from 'next/server';
import openDatabase from '../../../../utils/openDB';

export const POST = async (req, res) => {
  console.log("delivery_address POST request");
  let db;
  try {
    db = await openDatabase();

    const { userID, first_name, last_name, phone, county, city, street, zip_code } = await req.json();
    
    console.log("Received data:", { userID, first_name, last_name, phone, county, city, street, zip_code });

    const updateUserQuery = `
      UPDATE users 
      SET first_name = ?, last_name = ?, phone = ?, county = ?, city = ?, street = ?, zip_code = ?
      WHERE id = ?
    `;

    await new Promise((resolve, reject) => {
      db.run(updateUserQuery, [first_name, last_name, phone, county, city, street, zip_code, userID], function(err) {
        if (err) {
          console.error('Error updating user data:', err.message);
          reject(err);
        } else {
          console.log(`Updated data for user ID: ${userID}. Rows affected: ${this.changes}`);
          resolve();
        }
      });
    });

    return new Response(JSON.stringify({ message: "User data updated successfully" }), {
      status: 200,
    });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ message: 'Error updating user data', error: err.message }, { status: 500 });
  } finally {
    if (db) {
      db.close();
    }
  }
};