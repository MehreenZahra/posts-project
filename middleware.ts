import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { parseToken } from "./utils/token";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");
  const { pathname } = request.nextUrl;

  if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
    if (accessToken?.value) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
  }
  if (!accessToken?.value && !refreshToken?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!accessToken?.value && refreshToken?.value) {
    // Client-side will handle token refresh
    return NextResponse.next();
  }

  const user = parseToken(accessToken!.value);
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/home/:path*"],
};
