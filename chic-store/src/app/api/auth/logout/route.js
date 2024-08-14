import { COOKIE_NAME } from "@/constants";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function GET() {
  const serialized = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: -1, // Set max age to -1 to expire the cookie
    path: "/",
  });

  return new NextResponse(JSON.stringify({ message: "Logged out successfully" }), {
    status: 200,
    headers: { "Set-Cookie": serialized },
  });
}