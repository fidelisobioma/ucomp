import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PrivateFolderClient from "./private-folder-client";

export default async function PrivateFolderPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const userId = (session.user as { id: string }).id;

  const [files, user] = await Promise.all([
    prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        storageUsed: true,
        storageLimit: true,
        plan: true,
      },
    }),
  ]);

  return (
    <PrivateFolderClient
      initialFiles={files}
      storageUsed={user?.storageUsed ?? 0}
      storageLimit={user?.storageLimit ?? 20971520}
      plan={user?.plan ?? "FREE"}
    />
  );
}
