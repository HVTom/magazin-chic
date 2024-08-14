import openDatabase from "@/utils/openDB";
import { NextResponse } from 'next/server';
import axios from 'axios';

const getProductImages = async (productId) => {
  try {
    const response = await axios.get(`https://${process.env.BASE_HOSTNAME}/chic-store/${productId}/`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        AccessKey: process.env.ACCESS_KEY
      }
    });

    const images = response.data.map((image) => `https://chic-store-images.b-cdn.net/${productId}/${image.ObjectName}`);
    console.log("IMAGES", images);
    return images;
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
};

export async function POST(req) {
  const db = await openDatabase();

  try {
    const { userId, shippingAddress, paymentMethod } = await req.json();
    console.log(`Checkout initiated for user ID: ${userId}, payment method: ${paymentMethod}`);

    // Start a transaction
    await db.run('BEGIN TRANSACTION');
    console.log('Transaction started');

    // 1. Create a new order
    const { lastID: orderId } = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO orders (user_id, order_date, status, shipping_address, payment_method)
        VALUES (?, CURRENT_TIMESTAMP, 'in asteptare', ?, ?)
      `, [userId, shippingAddress, paymentMethod], function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
    console.log(`New order created with ID: ${orderId}, payment method: ${paymentMethod}`);

    // 2. Get cart items
    const cartItems = await new Promise((resolve, reject) => {
      db.all(`
        SELECT
          ci.item_size_color_id,
          i.id as item_id,
          i.name,
          i.new_price,
          i.price,
          isc.size_id,
          isc.color_id,
          s.size,
          c.color
        FROM cart_items ci
        JOIN item_size_color isc ON ci.item_size_color_id = isc.id
        JOIN items i ON isc.item_id = i.id
        JOIN item_sizes s ON isc.size_id = s.id
        JOIN item_colors c ON isc.color_id = c.id
        WHERE ci.user_id = ?
      `, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    console.log(`Retrieved ${cartItems.length} items from cart:`, cartItems);

    let totalPrice = 0;
    const unavailableItems = [];

    // 3. Process each cart item
    for (const item of cartItems) {
      console.log(`Processing item: ${item.name}, ID: ${item.item_id}`);

      // Check if item is available
      const available = await new Promise((resolve, reject) => {
        db.get('SELECT quantity FROM items WHERE id = ?', [item.item_id], (err, row) => {
          if (err) reject(err);
          else resolve(row && row.quantity > 0);
        });
      });
      console.log(`Item availability: ${available}`);

      if (available) {
        // Fetch the thumbnail
        const images = await getProductImages(item.item_id);
        let thumbnailBlob = null;
        if (images.length > 0) {
          try {
            const thumbnailUrl = images[0];
            const thumbnailResponse = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
            thumbnailBlob = Buffer.from(thumbnailResponse.data);
          } catch (error) {
            console.error(`Error downloading thumbnail for item ${item.item_id}:`, error);
          }
        }

        // Add to order_items with thumbnail
        await new Promise((resolve, reject) => {
          db.run(`
            INSERT INTO order_items (order_id, item_id, price, size, color, thumbnail)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [orderId, item.item_id, item.new_price || item.price, item.size, item.color, thumbnailBlob], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        console.log(`Added item to order_items: ${item.name}`);

        // Decrease item quantity in items table
        await new Promise((resolve, reject) => {
          db.run('UPDATE items SET quantity = quantity - 1 WHERE id = ?', [item.item_id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        console.log(`Decreased quantity for item: ${item.name}`);

        // Delete the specific size-color combination from item_size_color
        await new Promise((resolve, reject) => {
          db.run('DELETE FROM item_size_color WHERE id = ?', [item.item_size_color_id], function (err) {
            if (err) reject(err);
            else {
              console.log(`Deleted ${this.changes} entry from item_size_color for item: ${item.name}`);
              resolve();
            }
          });
        });

        // Check if this was the last size for this color, if so, delete from item_colors
        await new Promise((resolve, reject) => {
          db.run('DELETE FROM item_colors WHERE id = ? AND NOT EXISTS (SELECT 1 FROM item_size_color WHERE color_id = ?)',
            [item.color_id, item.color_id],
            function (err) {
              if (err) reject(err);
              else {
                console.log(`Deleted ${this.changes} entry from item_colors for item: ${item.name}`);
                resolve();
              }
            }
          );
        });

        // Check if this was the last color for this size, if so, delete from item_sizes
        await new Promise((resolve, reject) => {
          db.run('DELETE FROM item_sizes WHERE id = ? AND NOT EXISTS (SELECT 1 FROM item_size_color WHERE size_id = ?)',
            [item.size_id, item.size_id],
            function (err) {
              if (err) reject(err);
              else {
                console.log(`Deleted ${this.changes} entry from item_sizes for item: ${item.name}`);
                resolve();
              }
            }
          );
        });

        totalPrice += item.new_price || item.price;
        console.log(`Updated total price: ${totalPrice}`);
      } else {
        unavailableItems.push(item.name);
        console.log(`Item unavailable: ${item.name}`);
      }
    }

    // 4. Update order total price
    await new Promise((resolve, reject) => {
      db.run('UPDATE orders SET total_price = ? WHERE id = ?', [totalPrice, orderId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log(`Updated order total price: ${totalPrice}`);

    // 5. Clear the user's cart
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM cart_items WHERE user_id = ?', [userId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log(`Cleared cart for user ID: ${userId}`);

    // Commit the transaction
    await db.run('COMMIT');
    console.log('Transaction committed');

    // Close the database connection
    db.close();
    console.log('Database connection closed');

    if (unavailableItems.length > 0) {
      console.log(`Order placed with unavailable items: ${unavailableItems.join(', ')}`);
      return NextResponse.json({
        message: 'Order placed with some unavailable items',
        orderId,
        unavailableItems,
        paymentMethod
      }, { status: 206 });
    } else {
      console.log('Order placed successfully');
      return NextResponse.json({
        message: 'Order placed successfully',
        orderId,
        paymentMethod
      }, { status: 200 });
    }

  } catch (error) {
    // If there's an error, rollback the transaction
    await db.run('ROLLBACK');
    console.error("Error processing checkout. Transaction rolled back:", error);
    db.close();
    console.log('Database connection closed after error');
    return NextResponse.json({ message: 'Error processing checkout', error: error.message }, { status: 500 });
  }
}