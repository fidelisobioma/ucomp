import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendEmailChangeVerification } from "@/lib/email";
import crypto from "crypto";
import { z } from "zod";
import { getAuthToken } from "@/lib/get-token";

const changeEmailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
});

export async function PATCH(req: NextRequest) {
  try {
    const token = await getAuthToken(req);

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = changeEmailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const { newEmail } = result.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already in use." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Delete existing email change tokens
    await prisma.emailChangeToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await prisma.emailChangeToken.create({
      data: {
        userId: user.id,
        newEmail,
        token: verifyToken,
        expiresAt,
      },
    });

    const verifyUrl = `${process.env.AUTH_URL}/api/settings/verify-email?token=${verifyToken}`;

    await sendEmailChangeVerification(
      user.email, // use current email for testing
      user.name ?? "User",
      verifyUrl,
    );

    return NextResponse.json({
      message: "Verification email sent to your new email address.",
    });
  } catch (error) {
    console.error("Change email error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
