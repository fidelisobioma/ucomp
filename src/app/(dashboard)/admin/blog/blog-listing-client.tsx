"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  createdAt: Date;
  author: { name: string | null; image: string | null };
}

const categories = ["ALL", "GENERAL", "TIPS", "NEWS", "UPDATES"];

const categoryColors: Record<string, string> = {
  GENERAL: "bg-slate-100 text-slate-700",
  TIPS: "bg-blue-100 text-blue-700",
  NEWS: "bg-green-100 text-green-700",
  UPDATES: "bg-amber-100 text-amber-700",
};

export default function BlogListingClient({ posts }: { posts: Post[] }) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredPosts =
    selectedCategory === "ALL"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
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
              {/* Cover Image */}
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

              {/* Content */}
              <div className="space-y-3 p-5">
                <Badge className={`text-xs ${categoryColors[post.category]}`}>
                  {post.category}
                </Badge>
                <h3 className="font-semibold text-slate-900 group-hover:text-slate-600 line-clamp-2 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-50 px-2 py-0.5 rounded text-slate-400 text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author + Date */}
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
