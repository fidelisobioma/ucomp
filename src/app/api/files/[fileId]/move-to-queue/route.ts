import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
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

    const { fileId } = await params;

    // Find file and verify ownership
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (file.userId !== token.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if already in queue
    const existingQueueItem = await prisma.printQueueItem.findFirst({
      where: {
        fileId,
        status: "PENDING",
      },
    });

    if (existingQueueItem) {
      return NextResponse.json(
        { error: "File is already in the print queue" },
        { status: 400 },
      );
    }

    // Set expiry to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Create print queue item
    const queueItem = await prisma.printQueueItem.create({
      data: {
        fileId,
        userId: token.id as string,
        expiresAt,
      },
    });

    // Notify all admins
    const admins = await prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "SUPERADMIN"] },
      },
      select: { id: true },
    });

    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        message: `A new document "${file.name}" has been added to the print queue.`,
        type: "PRINT" as const,
      })),
    });

    return NextResponse.json({ queueItemId: queueItem.id });
  } catch (error) {
    console.error("Move to queue error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
