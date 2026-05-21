import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const userId = (session.user as { id: string }).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      password: true,
      storageUsed: true,
      storageLimit: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/sign-in");

  return <SettingsClient user={user} />;
}
