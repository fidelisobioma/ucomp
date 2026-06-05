"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: Date;
  author: { name: string | null; image: string | null };
}

export default function BlogListingClient({
  posts,
  categories,
}: {
  posts: Post[];
  categories: Category[];
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");

  const filteredPosts =
    selectedCategoryId === "ALL"
      ? posts
      : posts.filter((p) => p.category.id === selectedCategoryId);

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setSelectedCategoryId("ALL")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategoryId === "ALL"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategoryId === cat.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-slate-500">No posts in this category yet.</p>
        </div>
      ) : (
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white hover:shadow-md border rounded-2xl overflow-hidden transition-shadow"
            >
              <div className="relative bg-slate-100 h-48">
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

              <div className="space-y-3 p-5">
                <Badge variant="secondary" className="text-xs">
                  {post.category.name}
                </Badge>
                <h3 className="font-semibold text-slate-900 group-hover:text-slate-600 line-clamp-2 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2">
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
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
