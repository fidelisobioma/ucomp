import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthToken } from "@/lib/get-token";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const token = await getAuthToken(req);

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (token.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;
    const body = await req.json();
    const { role } = body;

    if (!["USER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Prevent super admin from changing their own role
    if (userId === token.id) {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    // Notify the user of role change
    await prisma.notification.create({
      data: {
        userId,
        message:
          role === "ADMIN"
            ? "You have been promoted to Admin. You can now manage print queues."
            : "Your role has been updated to User.",
        type: "ROLE_CHANGE",
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
