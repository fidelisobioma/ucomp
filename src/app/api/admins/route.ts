import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthToken } from "@/lib/get-token";

export async function GET(req: NextRequest) {
  try {
    const token = await getAuthToken(req);

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admins = await prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "SUPERADMIN"] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: {
            assignedQueueItems: {
              where: { status: "PENDING" },
            },
          },
        },
      },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Get admins error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
