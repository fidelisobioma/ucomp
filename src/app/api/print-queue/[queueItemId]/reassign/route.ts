import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ queueItemId: string }> },
) {
  try {
    const token = await getAuthToken(req);

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { queueItemId } = await params;
    const body = await req.json();
    const { newAdminId } = body;

    const queueItem = await prisma.printQueueItem.findUnique({
      where: { id: queueItemId },
      include: { file: true },
    });

    if (!queueItem) {
      return NextResponse.json(
        { error: "Queue item not found" },
        { status: 404 },
      );
    }

    // Check if user owns the file or is super admin
    const isSuperAdmin = token.role === "SUPERADMIN";
    const isOwner = queueItem.userId === token.id;

    if (!isOwner && !isSuperAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Users can only reassign PENDING items
    if (isOwner && !isSuperAdmin && queueItem.status !== "PENDING") {
      return NextResponse.json(
        { error: "Cannot reassign a document that has already been printed" },
        { status: 400 },
      );
    }

    // Verify new admin exists
    const newAdmin = await prisma.user.findUnique({
      where: {
        id: newAdminId,
        role: { in: ["ADMIN", "SUPERADMIN"] },
      },
    });

    if (!newAdmin) {
      return NextResponse.json(
        { error: "Selected admin not found" },
        { status: 404 },
      );
    }

    const oldAdminId = queueItem.assignedAdminId;

    // Update assigned admin
    await prisma.printQueueItem.update({
      where: { id: queueItemId },
      data: { assignedAdminId: newAdminId },
    });

    // Notify old admin their file was reassigned
    if (oldAdminId) {
      await prisma.notification.create({
        data: {
          userId: oldAdminId,
          message: `Document "${queueItem.file.name}" has been reassigned to another admin.`,
          type: "PRINT",
        },
      });
    }

    // Notify new admin
    await prisma.notification.create({
      data: {
        userId: newAdminId,
        message: `Document "${queueItem.file.name}" has been assigned to you for printing.`,
        type: "PRINT",
      },
    });

    // Notify user if reassigned by super admin
    if (isSuperAdmin && !isOwner) {
      await prisma.notification.create({
        data: {
          userId: queueItem.userId,
          message: `Your document "${queueItem.file.name}" has been reassigned to a different admin.`,
          type: "PRINT",
        },
      });
    }

    return NextResponse.json({ message: "Reassigned successfully" });
  } catch (error) {
    console.error("Reassign error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
