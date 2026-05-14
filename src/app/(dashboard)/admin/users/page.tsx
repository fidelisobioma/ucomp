import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminUsersClient from "./admin-users-client";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role: string }).role;
  const adminId = (session.user as { id: string }).id;

  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect("/sign-in");

  const users = await prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: {
        select: {
          printQueueItems: {
            where: {
              assignedAdminId: adminId,
              status: "PENDING",
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <AdminUsersClient users={users} />;
}
