import openDatabase from "@/utils/openDB";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const db = await openDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const userFullData = await new Promise((resolve, reject) => {
      db.get(`
        SELECT id, first_name, last_name, email, phone, county, city, street, zip_code 
        FROM users 
        WHERE id = ?`,
        [userId],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    console.log("user full details: ", userFullData);

    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      }
    });

    return NextResponse.json(userFullData, { status: 200 });
  } catch (error) {
    console.error("Error retrieving items from database:", error);
    return NextResponse.json({ message: 'Error retrieving items', error: error.message }, { status: 500 });
  }
}