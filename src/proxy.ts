import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import type { NextRequest } from "next/server";

type AuthRequest = NextRequest & { auth: Session | null };

const { auth } = NextAuth(authConfig);

export function proxy(req: AuthRequest) {
  const { nextUrl, auth: session } = req;

  console.log("PROXY SESSION:", JSON.stringify(session));
  console.log("PROXY PATH:", nextUrl.pathname);
  console.log("PROXY COOKIES:", req.cookies.getAll());
  const isLoggedIn = !!session?.user;

  const isAuthRoute =
    nextUrl.pathname.startsWith("/sign-in") ||
    nextUrl.pathname.startsWith("/sign-up");

  const isPublicRoute = nextUrl.pathname === "/";
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  if (!isLoggedIn && !isAuthRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default auth(proxy);
