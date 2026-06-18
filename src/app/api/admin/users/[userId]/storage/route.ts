import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

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
    const { storageLimitMB } = body;

    if (!storageLimitMB || storageLimitMB < 50) {
      return NextResponse.json(
        { error: "Storage limit must be at least 50MB" },
        { status: 400 },
      );
    }

    const storageLimitBytes = storageLimitMB * 1024 * 1024;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { storageLimit: storageLimitBytes },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Update storage error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
