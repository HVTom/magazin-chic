import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import openDatabase from "@/utils/openDB";
import { NextResponse } from 'next/server';
import axios from 'axios';




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

// GET item details
// ALSO ADD ASSOCIATED SIZES AND COLORS
export async function GET(req, res) {
  try {
    const db = await openDatabase();

    // get item id
    const productId = req.url.split("/").pop();
    console.log(`Accessed item with ID ${productId}`);

    // retrieve item details from the database
    const item = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM items WHERE id = ?", [productId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });


    // check if item data exists in database
    if (!item) {
      return NextResponse.json({ message: `Item with id ${productId} was not found` }, { status: 404 });
    }



    // unique sizes, each available size is displayed once
    const sizes = await new Promise((resolve, reject) => {
      db.all("SELECT DISTINCT size FROM item_sizes WHERE item_id = ?", [productId], (err, rows) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(rows.map(row => row.size));
        }
      })
    })
    console.log("DISCTINCT SIZES: ", sizes);


    // unique colors, each available color is displayed once
    const colors = await new Promise((resolve, reject) => {
      db.all("SELECT DISTINCT color FROM item_colors WHERE item_id = ?", [productId], (err, rows) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(rows.map(row => row.color));
        }
      })
    })
    console.log("DISCTINCT COLORS: ", colors);



    // retrieve distinct size-color combinations for the item
    const sizeColorCombinations = await new Promise((resolve, reject) => {
      db.all(`
            SELECT DISTINCT s.size, c.color
            FROM item_size_color sc
            JOIN item_sizes s ON sc.size_id = s.id
            JOIN item_colors c ON sc.color_id = c.id
            WHERE sc.item_id = ?`, [productId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    console.log("SIZE-COLOR COMBINATIONS: ", sizeColorCombinations);



    // fetch the corresponding images for the item
    const images = await getProductImages(productId);



    // construct the final item with all details
    const itemWithDetails = {
      ...item,
      images,
      sizes: await sizes,
      colors: await colors,
      sizeColorCombinations: await sizeColorCombinations
    };

    console.log(" FULL ITEM DETAILS: ", itemWithDetails);


    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      }
    });

    return NextResponse.json(itemWithDetails, { status: 200 });
  } catch (error) {
    console.error("Error retrieving item details from database:", error);
    return NextResponse.json({ message: 'Error retrieving item details', error: error.message }, { status: 500 });
  }
}



// // Let's initialize it as null initially, and we will assign the actual database instance later.
// let db = null;

// // Define the GET request handler function
// export async function GET(req, res) {
//   // Extract the "id" from the URL by splitting the URL and taking the last element
//   const id = req.url.split("/").pop();

//   // Log the extracted "id" to the console (for debugging purposes)
//   console.log(id);

//   // Check if the database instance has been initialized
//   if (!db) {
//     // If the database instance is not initialized, open the database connection
//     db = await open({
//       filename: "./chic_store.db", // Specify the database file path
//       driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
//     });
//   }

//   // Perform a database query to retrieve an item based on the id
//   const item = await db.get("SELECT * FROM items WHERE id = ?", id);

//   // Return the items as a JSON response with status 200
//   return new Response(JSON.stringify(item), {
//     headers: { "Content-Type": "application/json" },
//     status: 200,
//   });
// }