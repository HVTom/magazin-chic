import openDatabase from "@/utils/openDB";
import { NextResponse } from 'next/server';
import axios from "axios";


const SHIPPING_FEE = 15;
const FREE_SHIPPING_THRESHOLD = 200;

export async function POST(req) {
  try {
    const db = await openDatabase();
    const { userId, itemId, selectedSize, selectedColor } = await req.json();
    console.log("Received data:", { userId, itemId, selectedSize, selectedColor });

    // Check if the size-color combination exists for the item
    const itemSizeColor = await new Promise((resolve, reject) => {
      db.get(`
        SELECT isc.id
        FROM item_size_color isc
        JOIN item_sizes s ON isc.size_id = s.id
        JOIN item_colors c ON isc.color_id = c.id
        WHERE isc.item_id = ? AND s.size = ? AND c.color = ?
      `, [itemId, selectedSize, selectedColor], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!itemSizeColor) {
      return NextResponse.json({ message: 'Invalid size-color combination for the item' }, { status: 400 });
    }

    // Add the item to the cart as a new entry
    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO cart_items (user_id, item_size_color_id)
        VALUES (?, ?)
      `, [userId, itemSizeColor.id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });

    const cartItemId = result;

    // Retrieve the item details
    const item = await new Promise((resolve, reject) => {
      db.get(`
        SELECT i.name, i.price
        FROM items i
        WHERE i.id = ?
      `, [itemId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      }
    });

    const { name, price } = item;
    const message = `Item ${name} with id ${itemId}, size ${selectedSize}, color ${selectedColor}, and price ${price} added to cart.`;

    return NextResponse.json({ message, cartItemId }, { status: 200 });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ message: 'Error adding item to cart', error: error.message }, { status: 500 });
  }
}



// called when user cancels the popup after adding to cart
export async function DELETE(req) {
  try {
    const db = await openDatabase();
    const { userId, itemId, selectedSize, selectedColor } = await req.json();

    // First, get the item_size_color_id
    const itemSizeColor = await new Promise((resolve, reject) => {
      db.get(`
        SELECT isc.id as item_size_color_id
        FROM item_size_color isc
        JOIN item_sizes s ON isc.size_id = s.id
        JOIN item_colors c ON isc.color_id = c.id
        WHERE isc.item_id = ? AND s.size = ? AND c.color = ?
      `, [itemId, selectedSize, selectedColor], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!itemSizeColor) {
      return NextResponse.json({ message: 'Invalid item, size, or color combination' }, { status: 400 });
    }

    // Delete the item from the cart using user_id and item_size_color_id
    const result = await new Promise((resolve, reject) => {
      db.run('DELETE FROM cart_items WHERE user_id = ? AND item_size_color_id = ?',
        [userId, itemSizeColor.item_size_color_id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes);
          }
        }
      );
    });

    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      }
    });

    if (result === 0) {
      return NextResponse.json({ message: 'Item not found in user\'s cart' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json({ message: 'Error removing item from cart', error: error.message }, { status: 500 });
  }
}




// function and route to get the cart items and the first image 
// from storage for each item
// also gets the user's delivery details
const getProductImage = async (productId) => {
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
    if (response.data.length > 0) {
      const image = `https://chic-store-images.b-cdn.net/${productId}/${response.data[0].ObjectName}`;
      console.log("IMAGE", image);
      return image;
    } else {
      return null;  // Or a default image URL if you prefer
    }
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
};

export async function GET(req) {
  try {
    const db = await openDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Fetch all user details in one query
    const userDetails = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          first_name, last_name, email, phone, county, city, street, zip_code,
          invoice_type, billing_first_name, billing_last_name, billing_county,
          billing_city, billing_street, billing_zip_code, billing_phone,
          billing_email, billing_company_name, billing_cui
        FROM users 
        WHERE id = ?
      `, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    const cartItems = await new Promise((resolve, reject) => {
      db.all(`
        SELECT
          ci.item_size_color_id as cart_item_id,
          isc.item_id,
          i.name,
          i.new_price,
          i.price,
          i.description,
          i.type,
          i.material,
          s.size,
          c.color
        FROM cart_items ci
        JOIN item_size_color isc ON ci.item_size_color_id = isc.id
        JOIN items i ON isc.item_id = i.id
        JOIN item_sizes s ON isc.size_id = s.id
        JOIN item_colors c ON isc.color_id = c.id
        WHERE ci.user_id = ?
      `, [userId], async (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const itemsWithImages = await Promise.all(
            rows.map(async (item) => {
              // const images = await getProductImages(item.item_id);
              const thumbnail = await getProductImage(item.item_id);
              return { ...item, thumbnail };
            })
          );
          resolve(itemsWithImages);
        }
      });
    });

    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      }
    });

    const response = {
      userDetails,
      cartItems
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    return NextResponse.json({ message: 'Error retrieving cart items', error: error.message }, { status: 500 });
  }
}