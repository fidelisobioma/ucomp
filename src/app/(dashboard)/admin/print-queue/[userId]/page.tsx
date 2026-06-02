import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminPrintQueueClient from "./admin-print-queue-client";

export default async function AdminUserPrintQueuePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role: string }).role;
  const adminId = (session.user as { id: string }).id;

  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect("/sign-in");

  const { userId } = await params;

  const [user, queueItems] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    }),
    prisma.printQueueItem.findMany({
      where: {
        userId,
        assignedAdminId: adminId,
        status: { in: ["PENDING", "PRINTED"] },
        expiresAt: { gt: new Date() },
      },
      include: {
        file: true,
        printLogs: {
          orderBy: { printedAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!user) redirect("/admin/users");

  return <AdminPrintQueueClient user={user} queueItems={queueItems} />;
}
