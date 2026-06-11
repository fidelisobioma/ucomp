import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function getAuthToken(req: NextRequest) {
  const secureCookie =
    req.headers.get("x-forwarded-proto") === "https" ||
    req.nextUrl.protocol === "https:";

  const cookieName = secureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  return getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName,
  });
}
