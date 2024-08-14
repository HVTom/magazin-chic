// [...nextauth].js - handle token and session on login/logout
// /app/lib/actions.js (this file) 
// -> server component, use the signIn (and reister?) from nextAuth here
// then, (i think) turn the login and register forms into components
// call the signIn/register there
// use middleware.js to check user roles and configure 
// allowed and forbidden routes, redirects so on
// registration handled with authenticate? or within [...nextauth].js
// 'use server'
// import { signIn } from '@/auth'
// import { AuthError } from 'next-auth';


// export async function authenticate(_currentState, formData) {
//   try {
//     await signIn('credentials', formData)
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'CredentialsSignin':
//           return 'Invalid credentials.'
//         default:
//           return 'Something went wrong.'
//       }
//     }
//     throw error
//   }
// }


// export async function serverAction() {
//   const session = await getSession()
//   const userRole = session?.user?.role

//   // Check if user is authorized to perform the action
//   if (userRole !== 'admin') {
//     throw new Error('Unauthorized access: User does not have admin privileges.')
//   }

//   // Proceed with the action for authorized users
//   // ... implementation of the action
// }


