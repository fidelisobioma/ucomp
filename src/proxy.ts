import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: "authjs.session-token",
  });

  const isLoggedIn = !!token;
  const { nextUrl } = req;

  const isAuthRoute =
    nextUrl.pathname.startsWith("/sign-in") ||
    nextUrl.pathname.startsWith("/sign-up") ||
    nextUrl.pathname.startsWith("/forgot-password") ||
    nextUrl.pathname.startsWith("/reset-password");

  // const isPublicRoute = nextUrl.pathname === "/";
  const isPublicRoute =
    nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/blog");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  // Logged in users cannot access auth routes
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Logged out users cannot access dashboard
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  // Logged out users cannot access protected routes
  if (!isLoggedIn && !isAuthRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default proxy;
