import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogPostForm from "@/components/dashboard/blog-post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role: string }).role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect("/dashboard");

  const { slug } = await params;

  // slug here is actually the post ID from the management page
  const post = await prisma.blogPost.findUnique({
    where: { id: slug },
  });

  if (!post) redirect("/blog");

  return (
    <div className="space-y-6 mx-auto max-w-4xl">
      <div>
        <h2 className="font-bold text-slate-900 text-2xl">Edit Post</h2>
        <p className="mt-1 text-slate-500">Update your blog post</p>
      </div>
      <BlogPostForm
        initialData={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          coverImage: post.coverImage,
          published: post.published,
        }}
      />
    </div>
  );
}
