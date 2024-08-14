// remove-unavailable-cart-items
import openDatabase from "@/utils/openDB";
import { NextResponse } from 'next/server';

export async function POST(req) {
  const db = await openDatabase();
  try {
    const { userId, items } = await req.json();
    
    console.log(`Attempting to remove unavailable items for user ${userId}`);
    console.log('Items to remove:', JSON.stringify(items, null, 2));

    for (const item of items) {
      console.log(`Processing item: ${JSON.stringify(item)}`);
      
      const query = `
        DELETE FROM cart_items
        WHERE user_id = ? AND item_size_color_id IN (
          SELECT isc.id
          FROM item_size_color isc
          JOIN item_sizes s ON isc.size_id = s.id
          JOIN item_colors c ON isc.color_id = c.id
          WHERE isc.item_id = ? AND s.size = ? AND c.color = ?
        )
      `;
      
      console.log('Executing query:', query);
      console.log('Query parameters:', [userId, item.item_id, item.size, item.color]);

      const result = await new Promise((resolve, reject) => {
        db.run(query, [userId, item.item_id, item.size, item.color], function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        });
      });

      console.log(`Rows affected for item ${item.item_id}: ${result}`);
    }

    db.close();
    console.log('Database connection closed');

    console.log('All unavailable items processed');
    return NextResponse.json({ message: 'Unavailable items removed from cart' }, { status: 200 });
  } catch (error) {
    console.error("Error removing unavailable items:", error);
    return NextResponse.json({ message: 'Error removing unavailable items', error: error.message }, { status: 500 });
  }
}