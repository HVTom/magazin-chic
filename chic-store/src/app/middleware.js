// import { cookies } from "next/headers";
// import { COOKIE_NAME } from "@/constants";
// import { verify } from "jsonwebtoken";
// import { NextResponse, NextRequest } from "next/server";

// export async function middleware(request) {
//   const { pathname } = request.nextUrl;

//   // Check if cookie exists
//   const cookieStore = cookies(request.nextUrl.headers);
//   const token = cookieStore.get(COOKIE_NAME);

//   // Verify and decode the token
//   let user = null;
//   if (token) {
//     try {
//       user = verify(token.value, process.env.JWT_SECRET);
//     } catch (error) {
//       console.error("Token verification failed:", error);
//     }
//   }

//   // Prevent access to certain routes if no valid token exists
//   const unauthorizedRoutes = [
//     "/dashboard", 
//     "/account", 
//     "/cart", 
//     "/api/shopping_cart",
//     "/api/dashboard",
//     "/api/account",
//     "/api/get_user",
//     "/api/orders",
//   ];
//     if (!user && unauthorizedRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   const Redirect = () => {
//     if (user && user.role === "admin") {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     } else if (user && user.role === "customer") {
//       return NextResponse.redirect(new URL("/account", request.url));
//     } else {
//       return NextResponse.redirect(
//         new URL("/login?error=Please login first to access this route", request.url)
//       );
//     }
//   };

//   // Allow access to login and register routes for all users
//   if (pathname.startsWith("/api/auth/login") || pathname.startsWith("/api/auth/register")) {
//     return NextResponse.next();
//   }

//   // Ensure only admin users can access the dashboard
//   if (user && pathname === "/dashboard" && user.role !== "admin") {
//     return NextResponse.redirect(new URL("/account", request.url));
//   }

//   // Ensure only logged-in users can access the account page
//   if (!user && pathname === "/account") {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Protect API routes
//   if (!user && (pathname.startsWith("/api/dashboard") || pathname.startsWith("/api/account"))) {
//     return Response.json(
//       { success: false, message: "authentication failed" },
//       { status: 401 }
//     );
//   }

//   // Ensure only admin users can access admin API routes
//   if (user && pathname.startsWith("/api/dashboard") && user.role !== "admin") {
//     return Response.json(
//       { success: false, message: "unauthorized access" },
//       { status: 403 }
//     );
//   }

//   // Allow access for authenticated users
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/login",
//     "/register",
//     "/forgot-password",
//     "/dashboard",
//     "/account",
//     "/cart",
//     "/api/shopping_cart",
//     "/api/auth/:path*",
//     "/api/dashboard/:path*",
//     "/api/account/:path*",
//   ],
// };