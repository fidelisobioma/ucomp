import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  // Private folder uploader
  privateUploader: f({
    pdf: { maxFileSize: "16MB", maxFileCount: 10 },
    image: { maxFileSize: "16MB", maxFileCount: 10 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "16MB",
      maxFileCount: 10,
    },
  })
    .middleware(async ({ req }) => {
      // Authenticate user
      const token = await getToken({
        req: req as unknown as NextRequest,
        secret: process.env.AUTH_SECRET,
        cookieName: "authjs.session-token",
      });

      if (!token?.id) throw new Error("Unauthorized");

      // Check storage limit
      const user = await prisma.user.findUnique({
        where: { id: token.id as string },
        select: { storageUsed: true, storageLimit: true },
      });

      if (!user) throw new Error("User not found");

      if (user.storageUsed >= user.storageLimit) {
        throw new Error("Storage limit reached");
      }

      return { userId: token.id as string };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Determine file type
      const getFileType = (name: string) => {
        const ext = name.split(".").pop()?.toLowerCase();
        if (ext === "pdf") return "PDF";
        if (ext === "docx") return "DOCX";
        if (ext === "jpg" || ext === "jpeg") return "JPG";
        if (ext === "png") return "PNG";
        return "PDF";
      };

      // Save file metadata to database
      const savedFile = await prisma.file.create({
        data: {
          name: file.name,
          size: file.size,
          type: getFileType(file.name) as "PDF" | "DOCX" | "JPG" | "PNG",
          url: file.url,
          userId: metadata.userId,
        },
      });

      // Update user storage
      await prisma.user.update({
        where: { id: metadata.userId },
        data: { storageUsed: { increment: file.size } },
      });

      return { fileId: savedFile.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
