import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { UTApi } from "uploadthing/server";
import { getAuthToken } from "@/lib/get-token";

const utapi = new UTApi();

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const token = await getAuthToken(req);

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

    // Delete from Uploadthing
    const fileKey = file.url.split("/").pop();
    if (fileKey) {
      await utapi.deleteFiles(fileKey);
    }

    // Delete from database and update storage
    await prisma.file.delete({ where: { id: fileId } });
    await prisma.user.update({
      where: { id: token.id as string },
      data: { storageUsed: { decrement: file.size } },
    });

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
