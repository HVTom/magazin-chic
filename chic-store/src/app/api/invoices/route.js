import openDatabase from "@/utils/openDB";
import { NextResponse } from 'next/server';


// function to get the full order details
// user contact and delivery details + items
export async function GET(req) {
  try {
    const db = await openDatabase();

    const invoices = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          o.id AS order_id,
          strftime('%d/%m/%Y, %I:%M:%S %p', datetime(o.order_date, '+3 hours')) AS order_date,
          o.total_price,
          o.status,
          o.shipping_address,
          o.payment_method,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.invoice_type,
          u.billing_first_name,
          u.billing_last_name,
          u.billing_county,
          u.billing_city,
          u.billing_street,
          u.billing_zip_code,
          u.billing_phone,
          u.billing_email,
          u.billing_company_name,
          u.billing_cui,
          GROUP_CONCAT(
            json_object(
              'item_id', oi.item_id,
              'item_name', i.name,
              'price', oi.price,
              'size', oi.size,
              'color', oi.color
            )
          ) AS order_items
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN items i ON oi.item_id = i.id
        GROUP BY o.id
        ORDER BY order_date DESC
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Parse the order_items JSON string
          rows.forEach(row => {
            row.order_items = JSON.parse(`[${row.order_items}]`);
          });
          resolve(rows);
        }
      });
    });

    console.log("invoices: ", invoices);

    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      }
    });

    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error("Error retrieving items from database:", error);
    return NextResponse.json({ message: 'Error retrieving items', error: error.message }, { status: 500 });
  }
}



// function to change the order status
export async function POST(req) {
  try {
    const { orderId, status } = await req.json();
    const db = await openDatabase();

    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err);
      }
    });

    return NextResponse.json({ message: 'Order marked as shipped' }, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ message: 'Error updating order status', error: error.message }, { status: 500 });
  }
}