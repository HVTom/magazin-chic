import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import axios from 'axios';
import openDatabase from "@/utils/openDB";
import { NextResponse } from 'next/server';

// CAN'T NEST THIS SEARCH ROUTE INSIDE PRODUCTS ROUTE
// NESTING API ROTES IS ONLY FOR DYNAMIC RELATIONS
const getProductImages = async (productId) => {
  try {
    // route to list all images per folder
    const response = await axios.get(`https://${process.env.BASE_HOSTNAME}/chic-store/${productId}/`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        AccessKey: process.env.ACCESS_KEY
      }
    });

    // using the pull-zone url and attach the image name (ObjectName) to it to actually get it
    const images = response.data.map((image) => `https://chic-store-images.b-cdn.net/${productId}/${image.ObjectName}`);
    console.log("IMAGES", images);
    return images;
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
};


// search for items
export async function GET(req, res) {
  try {
    const db = await openDatabase();

    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('search')

    const query = "SELECT * FROM items WHERE name LIKE ? or description LIKE ?";
    const params = [`%${searchTerm}%`, `%${searchTerm}%`];



    // needs promise
    const items = await new Promise((resolve, reject) => {
      db.all(query, params, async (err, rows) => {
        if (err) {
          reject(err)
        } else {
          const itemsWithImages = await Promise.all(
            rows.map(async (item) => {
              const images = await getProductImages(item.id);
              return { ...item, images };
            })
          );
          resolve(itemsWithImages);
        }
      });
    });

    console.log("SEARCHED ITEMS: ", items);
    console.log("SEARCHED ITEMS: ", JSON.stringify(items));


    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      }
    })

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error retrieving items from database:", error);
    return NextResponse.json({ message: 'Error retrieving items', error: error.message }, { status: 500 });
  }
}
