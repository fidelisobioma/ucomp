import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// Mark all notifications as read
export async function POST(req: NextRequest) {
  try {
    const token = await getAuthToken(req);

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.notification.updateMany({
      where: {
        userId: token.id as string,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({ message: "Marked all as read" });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
