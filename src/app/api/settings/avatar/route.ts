import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

const utapi = new UTApi();

const updateAvatarSchema = z.object({
  imageUrl: z.string().url(),
});

export async function PATCH(req: NextRequest) {
  try {
    const token = await getAuthToken(req);

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = updateAvatarSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }

    // Delete old avatar from Uploadthing if exists
    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
      select: { image: true },
    });

    if (user?.image) {
      const oldKey = user.image.split("/").pop();
      if (oldKey) await utapi.deleteFiles(oldKey);
    }

    const updatedUser = await prisma.user.update({
      where: { id: token.id as string },
      data: { image: result.data.imageUrl },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Update avatar error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
