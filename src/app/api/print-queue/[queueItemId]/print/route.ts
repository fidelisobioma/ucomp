import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthToken } from "@/lib/get-token";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ queueItemId: string }> },
) {
  try {
    const token = await getAuthToken(req);

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (token.role !== "ADMIN" && token.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { queueItemId } = await params;
    const body = await req.json();
    const copies = parseInt(body.copies) || 1;

    if (copies < 1 || copies > 100) {
      return NextResponse.json(
        { error: "Copies must be between 1 and 100" },
        { status: 400 },
      );
    }

    const queueItem = await prisma.printQueueItem.findUnique({
      where: { id: queueItemId },
      include: { file: true, user: true },
    });

    if (!queueItem) {
      return NextResponse.json(
        { error: "Queue item not found" },
        { status: 404 },
      );
    }

    // Reset expiry timer to 24hrs from now
    const newExpiresAt = new Date();
    newExpiresAt.setHours(newExpiresAt.getHours() + 24);

    // Create print log and update expiry
    await prisma.$transaction([
      prisma.printLog.create({
        data: {
          printQueueItemId: queueItemId,
          adminId: token.id as string,
          copies,
        },
      }),
      prisma.printQueueItem.update({
        where: { id: queueItemId },
        data: {
          status: "PRINTED",
          expiresAt: newExpiresAt,
        },
      }),
      // Notify the user
      prisma.notification.create({
        data: {
          userId: queueItem.userId,
          message: `Your document "${queueItem.file.name}" has been printed — ${copies} cop(ies). You can delete it from your print queue, or it will auto-delete after 24 hours. Re-upload from your private folder anytime to print again.`,
          type: "PRINT",
        },
      }),
    ]);

    return NextResponse.json({ message: "Marked as printed successfully" });
  } catch (error) {
    console.error("Print error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
