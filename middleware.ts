import { NextRequest, NextResponse } from 'next/server';
export function middleware(request: NextRequest ){
 const token = request.cookies.get('token');
  // Check if the token exists
 if (!token) {
   return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login if not authenticated
 }
  return NextResponse.next(); // Proceed to the requested route
}
export const config = {
  matcher: ['/home'], // Add your protected routes here
};