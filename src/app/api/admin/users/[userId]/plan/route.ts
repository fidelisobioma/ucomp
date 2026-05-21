import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

const PLAN_STORAGE_LIMITS = {
  FREE: 20971520, // 20MB
  PREMIUM: 1073741824, // 1GB
  MAX: 5368709120, // 5GB
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      cookieName: "authjs.session-token",
    });

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (token.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;
    const body = await req.json();
    const { plan, durationMonths = 1 } = body;

    if (!["FREE", "PREMIUM", "MAX"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Calculate expiry date
    const planExpiresAt =
      plan === "FREE"
        ? null
        : new Date(new Date().setMonth(new Date().getMonth() + durationMonths));

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan,
        planStatus: "ACTIVE",
        planExpiresAt,
        storageLimit:
          PLAN_STORAGE_LIMITS[plan as keyof typeof PLAN_STORAGE_LIMITS],
      },
    });

    // Notify user of plan change
    await prisma.notification.create({
      data: {
        userId,
        message:
          plan === "FREE"
            ? "Your plan has been updated to Free (20MB storage)."
            : `Your plan has been upgraded to ${plan === "PREMIUM" ? "Premium (1GB)" : "Max (5GB)"} storage. Valid until ${planExpiresAt?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.`,
        type: "ROLE_CHANGE",
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Update plan error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
