// getUserId.js
// used in [productId] aka product details page
// to fetch ghe user id so we know tho whom
// we associate the product
'use server'
import { cookies } from "next/headers";
import { verify, decode } from "jsonwebtoken";
import { COOKIE_NAME } from "@/constants";

export async function getUserId() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    console.log("No token found");
    throw new Error("Token not found");
  }

  const { value } = token;
  const secret = process.env.JWT_SECRET || "";

  try {
    verify(value, secret);
    const decodedToken = decode(value);
    const { userId } = decodedToken;
    return userId;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid token");
  }
}