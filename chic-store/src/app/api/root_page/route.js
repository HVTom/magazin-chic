import openDatabase from "@/utils/openDB";
import { NextResponse } from 'next/server';
import axios from 'axios';

const getProductImage = async (productId) => {
  try {
    const response = await axios.get(`https://${process.env.BASE_HOSTNAME}/chic-store/${productId}/`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        AccessKey: process.env.ACCESS_KEY
      }
    });
    
    if (response.data.length > 0) {
      return `https://chic-store-images.b-cdn.net/${productId}/${response.data[0].ObjectName}`;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product image:', error);
    return null;
  }
};

export async function GET(req, res) {
  try {
    const db = await openDatabase();

    const getDiscountedItems = new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name, new_price, price, added_on
        FROM items
        WHERE new_price IS NOT NULL AND new_price < price
        ORDER BY (price - new_price) / price DESC
        LIMIT 5
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const getNewItems = new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name, new_price, price, added_on
        FROM items
        WHERE julianday('now') - julianday(added_on) <= 15
        ORDER BY added_on DESC
        LIMIT 5
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const [discountedItems, newItems] = await Promise.all([getDiscountedItems, getNewItems]);

    const allItems = [...discountedItems, ...newItems];

    const itemsWithImage = await Promise.all(
      allItems.map(async (item) => {
        const image = await getProductImage(item.id);
        return { ...item, image };
      })
    );

    console.log("GET DISCOUNTED AND NEW ITEMS: ", itemsWithImage);

    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      }
    });

    return NextResponse.json(itemsWithImage, { status: 200 });
  } catch (error) {
    console.error("Error retrieving items from database:", error);
    return NextResponse.json({ message: 'Error retrieving items', error: error.message }, { status: 500 });
  }
}