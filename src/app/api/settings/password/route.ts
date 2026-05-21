import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      cookieName: "authjs.session-token",
    });

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = changePasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Password change not available for Google accounts." },
        { status: 400 },
      );
    }

    const passwordMatch = await bcrypt.compare(
      result.data.currentPassword,
      user.password,
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(result.data.newPassword, 12);

    await prisma.user.update({
      where: { id: token.id as string },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
