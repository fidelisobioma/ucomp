import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ queueItemId: string }> },
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

    const { queueItemId } = await params;

    const queueItem = await prisma.printQueueItem.findUnique({
      where: { id: queueItemId },
    });

    if (!queueItem) {
      return NextResponse.json(
        { error: "Queue item not found" },
        { status: 404 },
      );
    }

    if (queueItem.userId !== token.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.printQueueItem.delete({
      where: { id: queueItemId },
    });

    return NextResponse.json({ message: "Removed from queue successfully" });
  } catch (error) {
    console.error("Delete queue item error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
