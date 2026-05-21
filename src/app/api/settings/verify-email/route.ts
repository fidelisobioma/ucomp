import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/settings?error=invalid-token", req.url),
      );
    }

    const emailChangeToken = await prisma.emailChangeToken.findUnique({
      where: { token },
    });

    if (!emailChangeToken) {
      return NextResponse.redirect(
        new URL("/settings?error=invalid-token", req.url),
      );
    }

    if (emailChangeToken.expiresAt < new Date()) {
      await prisma.emailChangeToken.delete({ where: { token } });
      return NextResponse.redirect(
        new URL("/settings?error=expired-token", req.url),
      );
    }

    // Update email
    await prisma.user.update({
      where: { id: emailChangeToken.userId },
      data: { email: emailChangeToken.newEmail },
    });

    await prisma.emailChangeToken.delete({ where: { token } });

    return NextResponse.redirect(
      new URL("/settings?success=email-updated", req.url),
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.redirect(
      new URL("/settings?error=something-went-wrong", req.url),
    );
  }
}
