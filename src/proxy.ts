import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import type { NextRequest } from "next/server";

type AuthRequest = NextRequest & { auth: Session | null };

export function proxy(req: AuthRequest) {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  const isAuthRoute =
    nextUrl.pathname.startsWith("/sign-in") ||
    nextUrl.pathname.startsWith("/sign-up");

  const isPublicRoute = nextUrl.pathname === "/";

  // If on auth route and already logged in, redirect to dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // If not logged in and trying to access protected route, redirect to sign in
  if (!isLoggedIn && !isAuthRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default auth(proxy);
