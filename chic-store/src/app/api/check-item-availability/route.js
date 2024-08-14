import openDatabase from "@/utils/openDB";
import { NextResponse } from 'next/server';

export async function GET(req) {
  const db = await openDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    const size = searchParams.get('size');
    const color = searchParams.get('color');

    if (!itemId || !size || !color) {
      return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
    }

    const result = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 1 as available
        FROM items i
        JOIN item_size_color isc ON i.id = isc.item_id
        JOIN item_sizes s ON isc.size_id = s.id
        JOIN item_colors c ON isc.color_id = c.id
        WHERE i.id = ? AND s.size = ? AND c.color = ? AND i.quantity > 0
      `, [itemId, size, color], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    db.close();

    return NextResponse.json({ available: !!result }, { status: 200 });
  } catch (error) {
    console.error("Error checking item availability:", error);
    return NextResponse.json({ message: 'Error checking item availability', error: error.message }, { status: 500 });
  }
}