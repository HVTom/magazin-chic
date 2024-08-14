// /api/auth/login
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { serialize } from "cookie";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sign, verify, decode } from "jsonwebtoken";
import { COOKIE_NAME, MAX_AGE } from "@/constants";
import openDatabase from '../../../../utils/openDB';




const fetchUserSql = `SELECT id, email, password, role FROM users WHERE email = ?`;

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body; // get form data

  try {
    const db = await openDatabase();

    // Execute fetch user query
    const user = await new Promise((resolve, reject) => {
      db.get(fetchUserSql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    db.close();

    if (!user) {
      return NextResponse.json({ message: "User not found/wrong email", }, { status: 401, });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    // login form shared; unauthorize only if passwords are wrong
    if (!passwordMatch) {
      return NextResponse.json({ message: "Unauthorized/wrong pass", }, { status: 401, });
    }

    // Generate JWT token with user's role included
    const tokenPayload = { userId: user.id, email, role: user.role };
    const token = sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: MAX_AGE });

    // Serialize token into cookie
    const serialized = serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: MAX_AGE,
      path: "/",
    });

    // Return authenticated response
    return new Response(JSON.stringify({ message: "Authenticated!", token }), {
      status: 200,
      headers: { "Set-Cookie": serialized },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
