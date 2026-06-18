import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthToken } from "@/lib/get-token";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const token = await getAuthToken(req);

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId } = await params;
    const body = await req.json();
    const { assignedAdminId } = body;

    if (!assignedAdminId) {
      return NextResponse.json(
        { error: "Please select an admin to send your file to" },
        { status: 400 },
      );
    }

    // Verify assigned admin exists and is actually an admin
    const assignedAdmin = await prisma.user.findUnique({
      where: {
        id: assignedAdminId,
        role: { in: ["ADMIN", "SUPERADMIN"] },
      },
    });

    if (!assignedAdmin) {
      return NextResponse.json(
        { error: "Selected admin not found" },
        { status: 404 },
      );
    }

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

    // Check if already in queue with active status
    const existingQueueItem = await prisma.printQueueItem.findFirst({
      where: {
        fileId,
        status: { in: ["PENDING", "PRINTED"] },
        expiresAt: { gt: new Date() }, // Only block if not expired
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

    // Create print queue item with assigned admin
    const queueItem = await prisma.printQueueItem.create({
      data: {
        fileId,
        userId: token.id as string,
        assignedAdminId,
        expiresAt,
      },
    });

    // Notify only the selected admin
    await prisma.notification.create({
      data: {
        userId: assignedAdminId,
        message: `A new document "${file.name}" has been sent to you for printing.`,
        type: "PRINT",
      },
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
