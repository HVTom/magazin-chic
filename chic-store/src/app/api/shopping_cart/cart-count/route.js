import { NextResponse } from 'next/server';
import { getUserId } from "@/utils/getUserId";
import openDatabase from "@/utils/openDB";

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    const db = await openDatabase();
    const count = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    db.close();

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}