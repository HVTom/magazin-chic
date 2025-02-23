import { COOKIE_NAME } from "@/constants";
import { verify, decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
    console.log("Verified value: ", value);

    const decodedToken = decode(value); // Decode the JWT token
    console.log("Decoded token: ", decodedToken);

    const { role } = decodedToken;

    if (role !== "admin") {
      return NextResponse.json({ message: "Unauthorized. Not an admin" }, { status: 403 });
    }

    const response = {
      user: "admin",
      role: role,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (e) {
    return NextResponse.json({ message: "Something went wrong", }, { status: 400, }
    );
  }
}