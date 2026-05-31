"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { UploadButton } from "@/lib/uploadthing";
import RichTextEditor from "@/components/dashboard/rich-text-editor";
import { X, Loader2 } from "lucide-react";
import Link from "next/link";

const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  excerpt: z
    .string()
    .min(10, "Excerpt is too short")
    .max(300, "Excerpt must be less than 300 characters"),
  categoryId: z.string().min(1, "Please select a category"),
});

type BlogPostInput = z.infer<typeof blogPostSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BlogPostFormProps {
  initialData?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    categoryId: string;
    tags: string[];
    coverImage: string | null;
    published: boolean;
  };
}

export default function BlogPostForm({ initialData }: BlogPostFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [content, setContent] = useState(initialData?.content ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      excerpt: initialData?.excerpt ?? "",
      categoryId: initialData?.categoryId ?? "",
    },
  });

  const selectedCategoryId = watch("categoryId");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/blog/categories");
        const data = await response.json();
        setCategories(data.categories);
      } catch {
        toast.error("Failed to load categories.");
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  async function onSubmit(data: BlogPostInput, published: boolean) {
    if (!content || content === "<p></p>") {
      toast.error("Please write some content for your post.");
      return;
    }

    setIsSubmitting(true);

    try {
      const url = initialData ? `/api/blog/${initialData.id}` : "/api/blog";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          content,
          coverImage,
          published,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error ?? "Failed to save post.");
        return;
      }

      toast.success(
        published ? "Post published successfully!" : "Post saved as draft.",
      );
      router.push("/admin/blog");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6">
      <FieldGroup className="gap-6">
        {/* Cover Image */}
        <div className="space-y-2">
          <FieldLabel>Cover Image</FieldLabel>
          {coverImage ? (
            <div className="relative border rounded-lg w-full h-48 overflow-hidden">
              <Image
                src={coverImage}
                alt="Cover"
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="top-2 right-2 absolute w-8 h-8"
                onClick={() => setCoverImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <UploadButton
              endpoint="blogCoverUploader"
              appearance={{
                button:
                  "bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-700",
                allowedContent: "hidden",
              }}
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  setCoverImage(res[0].url);
                  toast.success("Cover image uploaded.");
                }
              }}
              onUploadError={() => {
                toast.error("Failed to upload cover image.");
              }}
            />
          )}
        </div>

        {/* Title */}
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            placeholder="Enter post title..."
            {...register("title")}
          />
          <FieldError errors={[errors.title]} />
        </Field>

        {/* Excerpt */}
        <Field>
          <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
          <Input
            id="excerpt"
            placeholder="Brief summary of the post..."
            {...register("excerpt")}
          />
          <FieldError errors={[errors.excerpt]} />
        </Field>

        {/* Category */}
        <div className="space-y-2">
          <FieldLabel>Category</FieldLabel>
          {isLoadingCategories ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No categories found. Create one in{" "}
              <Link
                href="/admin/blog/categories"
                className="text-slate-900 underline"
              >
                Blog Categories
              </Link>
              .
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setValue("categoryId", cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    selectedCategoryId === cat.id
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
          {errors.categoryId && (
            <p className="text-destructive text-sm">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <FieldLabel>Content</FieldLabel>
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </FieldGroup>

      {/* Actions */}
      <div className="flex justify-end items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/blog")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSubmit((data) => onSubmit(data, false))}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save as Draft"}
        </Button>
        <Button
          type="button"
          onClick={handleSubmit((data) => onSubmit(data, true))}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </form>
  );
}
