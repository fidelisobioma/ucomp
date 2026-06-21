import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function BlogPreview() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    include: {
      author: { select: { name: true } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="bg-white py-24">
      <div className="mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-12">
          <div>
            <h2 className="font-bold text-slate-900 text-3xl md:text-4xl">
              Latest from our Blog
            </h2>
            <p className="mt-4 max-w-xl text-slate-500">
              Tips, news and updates from the Ucomp team
            </p>
          </div>
          <Button variant="outline" asChild className="gap-2 shrink-0">
            <Link href="/blog">
              See All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white hover:shadow-md border rounded-2xl overflow-hidden transition-shadow"
            >
              <div className="relative bg-slate-100 h-40">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex justify-center items-center bg-gradient-to-br from-slate-100 to-slate-200 w-full h-full">
                    <span className="text-slate-400 text-sm">No image</span>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 p-4">
                <Badge variant="secondary" className="text-xs">
                  {post.category.name}
                </Badge>
                <h3 className="font-semibold text-slate-900 group-hover:text-slate-600 text-sm line-clamp-2 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex justify-between items-center pt-2 border-t text-slate-400 text-xs">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author.name ?? "Anonymous"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
