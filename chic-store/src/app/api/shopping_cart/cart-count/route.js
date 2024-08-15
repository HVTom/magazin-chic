//cart count API
import { NextResponse } from 'next/server';
import { getUserId } from "@/utils/getUserId";
import openDatabase from "@/utils/openDB";

export async function GET() {
  try {
    const userId = await getUserId();
    console.log("User ID:", userId);

    if (!userId) {
      console.log("No user ID, returning count 0");
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    const db = await openDatabase();
    const count = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.count : 0);
      });
    });

    db.close();

    console.log("Returning count:", count);
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error('Error in cart count API:', error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}