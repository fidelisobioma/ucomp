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
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect("/sign-in");

  const { userId } = await params;

  const [user, queueItems] = await Promise.all([
    prisma.printQueueItem.findMany({
      where: { userId, status: "PENDING" },
      include: {
        file: true,
        printLogs: {
          orderBy: { printedAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

    prisma.printQueueItem.findMany({
      where: {
        userId,
        status: { in: ["PENDING", "PRINTED"] },
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
