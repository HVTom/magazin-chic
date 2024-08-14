import openDatabase from "@/utils/openDB";
import { NextResponse } from 'next/server';

export async function GET(req) {
  const db = await openDatabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userID');

  console.log('Received userId:', userId);

  try {
    const orders = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          o.id as order_id, 
          o.order_date,
          o.total_price,
          o.status,
          oi.id as item_id,
          oi.price as item_price,
          oi.size,
          oi.color,
          oi.thumbnail,
          i.name as item_name
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN items i ON oi.item_id = i.id
        WHERE o.user_id = ?
        ORDER BY o.order_date DESC
      `, [userId], (err, rows) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          console.log('Raw database results:', rows);
          resolve(rows);
        }
      });
    });

    console.log('Orders before grouping:', orders);

    // Group items by order
    const groupedOrders = orders.reduce((acc, row) => {
      if (!acc[row.order_id]) {
        acc[row.order_id] = {
          id: row.order_id,
          date: row.order_date,
          amount: row.total_price,
          status: row.status,
          items: []
        };
      }
      acc[row.order_id].items.push({
        id: row.item_id,
        name: row.item_name,
        price: row.item_price,
        size: row.size,
        color: row.color,
        thumbnail: row.thumbnail ? `data:image/jpeg;base64,${row.thumbnail.toString('base64')}` : null
      });
      return acc;
    }, {});

    const ordersList = Object.values(groupedOrders);

    console.log('Final ordersList:', ordersList);

    return NextResponse.json(ordersList, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: 'Error fetching orders', error: error.message }, { status: 500 });
  } finally {
    db.close();
  }
}


export async function PUT(req) {
  const db = await openDatabase();
  const { orderId } = await req.json();

  try {
    await new Promise((resolve, reject) => {
      db.run('UPDATE orders SET status = ? WHERE id = ?', ['returnat', orderId], (err) => {
        if (err) {
          console.error('Database update error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return NextResponse.json({ message: 'Order status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ message: 'Error updating order status', error: error.message }, { status: 500 });
  } finally {
    db.close();
  }
}