"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { UploadButton } from "@/lib/uploadthing";
import RichTextEditor from "@/components/dashboard/rich-text-editor";
import { X, Loader2, Eye, Pencil } from "lucide-react";
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
    coverImage: string | null;
    published: boolean;
  };
}

const DRAFT_KEY = "ucomp_blog_draft";

export default function BlogPostForm({ initialData }: BlogPostFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [content, setContent] = useState(initialData?.content ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
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
  const watchedTitle = watch("title");
  const watchedExcerpt = watch("excerpt");

  // Load draft from localStorage on mount
  useEffect(() => {
    if (initialData) return; // Don't restore draft when editing existing post
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setHasDraft(true);
        if (draft.title) setValue("title", draft.title);
        if (draft.excerpt) setValue("excerpt", draft.excerpt);
        if (draft.categoryId) setValue("categoryId", draft.categoryId);
        if (draft.content) setContent(draft.content);
        if (draft.coverImage) setCoverImage(draft.coverImage);
        toast.info("Draft restored from your last session.");
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, []);

  // Auto-save to localStorage every 2 seconds
  const saveDraft = useCallback(() => {
    if (initialData) return; // Don't auto-save when editing existing post
    const draft = {
      title: watchedTitle,
      excerpt: watchedExcerpt,
      categoryId: selectedCategoryId,
      content,
      coverImage,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [watchedTitle, watchedExcerpt, selectedCategoryId, content, coverImage]);

  useEffect(() => {
    const interval = setInterval(saveDraft, 2000);
    return () => clearInterval(interval);
  }, [saveDraft]);

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
  }

  // Fetch categories
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

      clearDraft();
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
    <div className="space-y-6">
      {/* Draft Banner */}
      {hasDraft && !initialData && (
        <div className="flex justify-between items-center bg-amber-50 p-3 border border-amber-200 rounded-lg">
          <p className="text-amber-700 text-sm">
            📝 Draft restored from your last session.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-700 hover:text-amber-900"
            onClick={() => {
              clearDraft();
              reset();
              setContent("");
              setCoverImage(null);
              toast.success("Draft cleared.");
            }}
          >
            Clear Draft
          </Button>
        </div>
      )}

      {/* Preview Toggle */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setIsPreview(!isPreview)}
        >
          {isPreview ? (
            <>
              <Pencil className="w-4 h-4" />
              Back to Editor
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Preview
            </>
          )}
        </Button>
      </div>

      {/* Preview Mode */}
      {isPreview ? (
        <div className="space-y-6 bg-white p-8 border rounded-xl">
          <h2 className="font-medium text-slate-400 text-xs uppercase tracking-wide">
            Preview
          </h2>

          {coverImage && (
            <div className="relative rounded-xl w-full h-64 overflow-hidden">
              <Image
                src={coverImage}
                alt="Cover"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-3">
            <p className="text-slate-400 text-xs">
              {categories.find((c) => c.id === selectedCategoryId)?.name ??
                "No category"}
            </p>
            <h1 className="font-bold text-slate-900 text-3xl">
              {watchedTitle || "Untitled Post"}
            </h1>
            <p className="text-slate-500 text-lg">{watchedExcerpt}</p>
          </div>

          <div
            className="max-w-none prose prose-slate"
            dangerouslySetInnerHTML={{
              __html:
                content || "<p class='text-slate-400'>No content yet...</p>",
            }}
          />
        </div>
      ) : (
        /* Edit Mode */
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
      )}
    </div>
  );
}
