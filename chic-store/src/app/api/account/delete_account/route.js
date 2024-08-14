import { NextResponse } from 'next/server';
import { COOKIE_NAME } from "@/constants";
import { cookies } from "next/headers";
import openDatabase from '../../../../utils/openDB';

export async function DELETE(req) {
  console.log("delete user account request");
  let db;
  try {
    db = await openDatabase();

    const { id, email } = await req.json();
    console.log("Extracted user id and email: ", id, email);

    if (!id || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Delete user's cart items
    const deleteCartItems = await new Promise((resolve, reject) => {
      db.run('DELETE FROM cart_items WHERE user_id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });

    console.log(`Deleted ${deleteCartItems} cart items for user ${id}`);

    // Delete user
    const deleteUser = await new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE email = ?', [email], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });

    if (deleteUser === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log(`User with email ${email} has been successfully deleted`);

    // Delete the cookie
    const cookieStore = cookies();
    cookieStore.delete(COOKIE_NAME);

    return NextResponse.json({ message: "User deleted successfully!" }, { status: 200 });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ message: 'Error', error: err.message }, { status: 500 });
  } finally {
    if (db) db.close();
  }
}