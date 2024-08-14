import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { serialize } from "cookie";
import { sign } from 'jsonwebtoken';
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';
import { COOKIE_NAME, MAX_AGE } from '../../../../constants/index';
import openDatabase from '../../../../utils/openDB';






const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};


export const POST = async (req, res) => {
  console.log("Register POST request");
  let db;
  try {
    db = await openDatabase();

    const { email, password } = await req.json();
    console.log(`EMAIL: ${email}`);
    console.log(`PASSWORD: ${password}`);

    // Check if the email already exists
    const userExists = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!row); // Return true if a row exists (email already exists)
        }
      });
    });

    if (userExists) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const hashedPassword = await hashPassword(password);

    let token;
    const insertUserSql = `INSERT INTO users (email, password) VALUES (?, ?)`;
    await new Promise((resolve, reject) => {
      db.run(insertUserSql, [email, hashedPassword], function (err) {
        if (err) {
          console.error('Error inserting user data into the database:', err.message);
          reject(err);
        } else {
          console.log(`User data inserted with ID: ${this.lastID}`);
          // Issue a JWT token for the newly registered user
          const tokenPayload = { userId: this.lastID, email, role: "customer" };
          token = sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: MAX_AGE });
          resolve();
        }
      });
    });

    // Serialize token into cookie
    const serialized = serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: MAX_AGE,
      path: "/",
    });

    // Return authenticated response
    return new Response(JSON.stringify({ message: "User data inserted successfully!", token }), {
      status: 200,
      headers: { "Set-Cookie": serialized },
    });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ message: 'Error', error: err.message }, { status: 500 });
  } finally {
    db.close();
  }
};
