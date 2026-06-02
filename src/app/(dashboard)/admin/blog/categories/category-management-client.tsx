"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  _count: { posts: number };
}

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

type CategoryInput = z.infer<typeof categorySchema>;

export default function CategoryManagementClient({
  categories: initialCategories,
}: {
  categories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createForm = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const editForm = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: editTarget?.name ?? "" },
  });

  async function handleCreate(data: CategoryInput) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error);
        return;
      }
      setCategories((prev) => [
        ...prev,
        { ...result.category, _count: { posts: 0 } },
      ]);
      toast.success("Category created successfully.");
      setShowCreateDialog(false);
      createForm.reset();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEdit(data: CategoryInput) {
    if (!editTarget) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/blog/categories/${editTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error);
        return;
      }
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editTarget.id
            ? { ...c, name: result.category.name, slug: result.category.slug }
            : c,
        ),
      );
      toast.success("Category updated successfully.");
      setEditTarget(null);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blog/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success("Category deleted successfully.");
      setDeleteTarget(null);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6 mx-auto max-w-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-slate-900 text-2xl">Blog Categories</h2>
          <p className="mt-1 text-slate-500">
            Manage your blog post categories
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white py-12 border rounded-lg text-center">
          <Tag className="mx-auto mb-3 w-10 h-10 text-slate-300" />
          <p className="text-slate-500 text-sm">
            No categories yet. Create your first category!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex justify-between items-center bg-white hover:shadow-sm p-4 border rounded-lg transition-shadow"
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900 text-sm">
                    {cat.name}
                  </p>
                  <p className="text-slate-400 text-xs">/{cat.slug}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {cat._count.posts} post{cat._count.posts !== 1 ? "s" : ""}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditTarget(cat);
                    editForm.setValue("name", cat.name);
                  }}
                >
                  <Pencil className="w-4 h-4 text-slate-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteTarget(cat)}
                  className="hover:bg-red-50 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
            <DialogDescription>Create a new blog category.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreate)}>
            <Field>
              <FieldLabel htmlFor="create-name">Category Name</FieldLabel>
              <Input
                id="create-name"
                placeholder="e.g. Tutorials"
                {...createForm.register("name")}
              />
              <FieldError errors={[createForm.formState.errors.name]} />
            </Field>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  createForm.reset();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category name.</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEdit)}>
            <Field>
              <FieldLabel htmlFor="edit-name">Category Name</FieldLabel>
              <Input
                id="edit-name"
                placeholder="e.g. Tutorials"
                {...editForm.register("name")}
              />
              <FieldError errors={[editForm.formState.errors.name]} />
            </Field>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditTarget(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-slate-900">
                    {deleteTarget?.name}
                  </span>
                  ?
                </p>
                {deleteTarget && (deleteTarget._count?.posts ?? 0) > 0 && (
                  <p className="bg-red-50 p-3 rounded-lg font-medium text-red-600 text-sm">
                    ⚠️ This will permanently delete {deleteTarget._count.posts}{" "}
                    post
                    {deleteTarget._count.posts !== 1 ? "s" : ""} belonging to
                    this category. This action cannot be undone.
                  </p>
                )}
              </div>
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
