import openDatabase from "@/utils/openDB";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const db = await openDatabase();

    const allItems = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM items`, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
      );
    });

    console.log("all current items: ", allItems);

    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      } else {
        console.log("Database connection closed successfully");
      }
    });

    return NextResponse.json(allItems, { status: 200 });
  } catch (error) {
    console.error("Error retrieving items from database:", error);
    return NextResponse.json({ message: 'Error retrieving items', error: error.message }, { status: 500 });
  }
}


// update item price/ set new_price
export async function PUT(req) {
  const { editingItemId, newPrice } = await req.json();

  console.log(`Updating item ${editingItemId} with new price ${newPrice}`);


  try {
    const db = await openDatabase();

    const updatedItem = await new Promise((resolve, reject) => {
      db.run(
        `UPDATE items SET new_price = ?, updated_on = CURRENT_TIMESTAMP WHERE id = ?`,
        [newPrice, editingItemId],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        }
      );
    });

    db.close();

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating item in database:", error);
    return NextResponse.json({ message: 'Error updating item', error: error.message }, { status: 500 });
  }
}