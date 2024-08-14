// api/get_user used to check the user role for routing after login/register
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/constants";
import { NextResponse } from "next/server";
import { verify, decode } from "jsonwebtoken";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ message: "Unauthorized", }, { status: 401, });
  }

  const { value } = token;
  // Always check this
  const secret = process.env.JWT_SECRET || "";

  try {
    verify(value, secret);
    const decodedToken = decode(value);
    const { userId, email, role } = decodedToken;

    return NextResponse.json({ user: { userId, email, role } }, { status: 200 });

  } catch (e) {
    return NextResponse.json({ message: "Invalid token", }, { status: 403, }
    );
  }
}