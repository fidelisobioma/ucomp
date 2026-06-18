import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getAuthToken } from "@/lib/get-token";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: { select: { posts: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getAuthToken(req);

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (token.role !== "ADMIN" && token.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const slug = generateSlug(result.data.name);

    const existing = await prisma.blogCategory.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A category with this name already exists." },
        { status: 400 },
      );
    }

    const category = await prisma.blogCategory.create({
      data: { name: result.data.name, slug },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
