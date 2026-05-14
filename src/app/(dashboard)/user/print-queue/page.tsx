import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UserPrintQueueClient from "./user-print-queue-client";

export default async function UserPrintQueuePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  const queueItems = await prisma.printQueueItem.findMany({
    where: {
      userId,
      status: { in: ["PENDING", "PRINTED"] },
    },
    include: {
      file: true,
      printLogs: {
        orderBy: { printedAt: "desc" },
        take: 1,
      },
      assignedAdmin: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <UserPrintQueueClient initialQueueItems={queueItems} role={role} />;
}
