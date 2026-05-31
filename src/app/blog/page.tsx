import { prisma } from "@/lib/prisma";
import BlogListingClient from "./blog-listing-client";
import HomeNavbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true, image: true } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    }),

    prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar solid />
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto px-6 max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="font-bold text-slate-900 text-4xl">Blog</h1>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Tips, news and updates from the Ucomp team
            </p>
          </div>
          <BlogListingClient posts={posts} categories={categories} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
