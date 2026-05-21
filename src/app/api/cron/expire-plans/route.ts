import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const gracePeriodEnd = new Date(now);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() - 7);

    // Find plans in grace period (expired but not yet downgraded)
    const graceUsers = await prisma.user.findMany({
      where: {
        plan: { not: "FREE" },
        planStatus: "ACTIVE",
        planExpiresAt: { lt: now },
      },
    });

    // Move expired active plans to GRACE
    if (graceUsers.length > 0) {
      await Promise.all(
        graceUsers.map(async (user) => {
          await prisma.user.update({
            where: { id: user.id },
            data: { planStatus: "GRACE" },
          });

          // Notify user of grace period
          await prisma.notification.create({
            data: {
              userId: user.id,
              message: `Your ${user.plan} plan has expired. You have 7 days to renew before being downgraded to Free. Contact us to renew your plan.`,
              type: "EXPIRY",
            },
          });
        }),
      );
    }

    // Find plans past grace period → downgrade to FREE
    const expiredUsers = await prisma.user.findMany({
      where: {
        plan: { not: "FREE" },
        planStatus: "GRACE",
        planExpiresAt: { lt: gracePeriodEnd },
      },
    });

    if (expiredUsers.length > 0) {
      await Promise.all(
        expiredUsers.map(async (user) => {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: "FREE",
              planStatus: "ACTIVE",
              planExpiresAt: null,
              storageLimit: 20971520, // 20MB
            },
          });

          // Notify user of downgrade
          await prisma.notification.create({
            data: {
              userId: user.id,
              message: `Your plan has been downgraded to Free (20MB). Your files are safe but you cannot upload new files until you upgrade. Contact us to resubscribe.`,
              type: "EXPIRY",
            },
          });
        }),
      );
    }

    return NextResponse.json({
      message: `Processed ${graceUsers.length} grace period users and ${expiredUsers.length} expired users.`,
    });
  } catch (error) {
    console.error("Plan expiry cron error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
