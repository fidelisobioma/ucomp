import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default async function BlogPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role: string }).role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect("/dashboard");

  const { id } = await searchParams;

  if (!id) redirect("/admin/blog");

  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, image: true } },
      category: true,
    },
  });

  if (!post) redirect("/admin/blog");

  return (
    <div className="space-y-6 mx-auto max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" asChild className="gap-2 -ml-2">
          <Link href="/admin/blog">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={
              post.published
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-500"
            }
          >
            {post.published ? "Published" : "Draft"}
          </Badge>
          <Button asChild size="sm">
            <Link href={`/admin/blog/${post.id}/edit`}>Edit Post</Link>
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative rounded-2xl w-full h-64 md:h-80 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Post Header */}
      <div className="space-y-4">
        <Badge variant="secondary" className="text-xs">
          {post.category.name}
        </Badge>
        <h1 className="font-bold text-slate-900 text-3xl md:text-4xl">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-slate-500 text-sm">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {post.author.name ?? "Anonymous"}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="max-w-none prose prose-slate"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
