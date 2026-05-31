import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogManagementClient from "./blog-management-client";

export default async function BlogManagementPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role: string }).role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect("/dashboard");

  const posts = await prisma.blogPost.findMany({
    include: {
      author: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return <BlogManagementClient posts={posts} />;
}
