import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryManagementClient from "./category-management-client";

export default async function CategoryManagementPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role: string }).role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect("/dashboard");

  const categories = await prisma.blogCategory.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  return <CategoryManagementClient categories={categories} />;
}
