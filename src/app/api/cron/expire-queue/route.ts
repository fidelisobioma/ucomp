import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Find all expired queue items (both PENDING and PRINTED)
    const expiredItems = await prisma.printQueueItem.findMany({
      where: {
        status: { in: ["PENDING", "PRINTED"] },
        expiresAt: { lt: now },
      },
      include: { file: true },
    });

    if (expiredItems.length === 0) {
      return NextResponse.json({ message: "No expired items found" });
    }

    await Promise.all(
      expiredItems.map(async (item) => {
        await prisma.$transaction([
          prisma.printQueueItem.update({
            where: { id: item.id },
            data: { status: "EXPIRED" },
          }),
          prisma.notification.create({
            data: {
              userId: item.userId,
              message: `Your document "${item.file.name}" has been auto-deleted from the print queue as it expired after 24 hours. You can move it to the queue again from your private folder.`,
              type: "EXPIRY",
            },
          }),
        ]);
      }),
    );

    console.log(`Expired ${expiredItems.length} queue items`);

    return NextResponse.json({
      message: `Expired ${expiredItems.length} queue items`,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
