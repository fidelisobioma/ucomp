"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PenLine, Trash2, Plus, Eye, EyeOff, ExternalLink } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  published: boolean;
  createdAt: Date;
  author: { name: string | null };
}

const categoryColors: Record<string, string> = {
  GENERAL: "bg-slate-100 text-slate-700",
  TIPS: "bg-blue-100 text-blue-700",
  NEWS: "bg-green-100 text-green-700",
  UPDATES: "bg-amber-100 text-amber-700",
};

export default function BlogManagementClient({
  posts: initialPosts,
}: {
  posts: Post[];
}) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/blog/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to delete post.");
        return;
      }

      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success("Post deleted successfully.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function handleTogglePublish(post: Post) {
    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });

      if (!response.ok) {
        toast.error("Failed to update post.");
        return;
      }

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, published: !p.published } : p,
        ),
      );

      toast.success(post.published ? "Post unpublished." : "Post published.");
    } catch {
      toast.error("Something went wrong.");
    }
  }

  return (
    <div className="space-y-6 mx-auto max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-slate-900 text-2xl">Blog</h2>
          <p className="mt-1 text-slate-500">Manage your blog posts</p>
        </div>
        <Button
          onClick={() => router.push("/admin/blog/new")}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white py-12 border rounded-lg text-center">
          <PenLine className="mx-auto mb-3 w-10 h-10 text-slate-300" />
          <p className="text-slate-500 text-sm">
            No blog posts yet. Create your first post!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex justify-between items-center bg-white hover:shadow-sm p-4 border rounded-lg transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    className={`text-xs ${categoryColors[post.category.name]}`}
                  >
                    {post.category.name}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      post.published
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="font-medium text-slate-900 text-sm truncate">
                  {post.title}
                </p>
                <p className="mt-0.5 text-slate-400 text-xs">
                  By {post.author.name} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    router.push(`/admin/blog/preview?id=${post.id}`)
                  }
                  title="Preview post"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleTogglePublish(post)}
                  title={post.published ? "Unpublish" : "Publish"}
                >
                  {post.published ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-500" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                >
                  <PenLine className="w-4 h-4 text-slate-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteTarget(post)}
                  className="hover:bg-red-50 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-900">
                {deleteTarget?.title}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
