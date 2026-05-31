import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import BlogPostForm from "@/components/dashboard/blog-post-form";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const role = (session.user as { role: string }).role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect("/dashboard");

  return (
    <div className="space-y-6 mx-auto max-w-4xl">
      <div>
        <h2 className="font-bold text-slate-900 text-2xl">New Blog Post</h2>
        <p className="mt-1 text-slate-500">Create a new blog post</p>
      </div>
      <BlogPostForm />
    </div>
  );
}
