import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HomeNavbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";
import { ArrowLeft, Calendar, User } from "lucide-react";

const categoryColors: Record<string, string> = {
  GENERAL: "bg-slate-100 text-slate-700",
  TIPS: "bg-blue-100 text-blue-700",
  NEWS: "bg-green-100 text-green-700",
  UPDATES: "bg-amber-100 text-amber-700",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: {
      author: { select: { name: true, image: true } },
    },
  });

  if (!post) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto px-6 max-w-3xl">
          {/* Back Button */}
          <Button variant="ghost" asChild className="gap-2 mb-6 -ml-2">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Button>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative mb-8 rounded-2xl w-full h-64 md:h-80 overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="space-y-4 mb-8">
            <Badge className={`text-xs ${categoryColors[post.category]}`}>
              {post.category}
            </Badge>
            <h1 className="font-bold text-slate-900 text-3xl md:text-4xl">
              {post.title}
            </h1>

            {/* Author + Date */}
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

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-100 px-2 py-1 rounded text-slate-500 text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div
            className="max-w-none prose prose-slate"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
