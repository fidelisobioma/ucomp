import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SuperAdminClient from "./super-admin-client";

export default async function RolesPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role: string }).role;
  if (role !== "SUPERADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    where: {
      role: { in: ["USER", "ADMIN"] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      storageLimit: true,
      storageUsed: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <SuperAdminClient users={users} />;
}
