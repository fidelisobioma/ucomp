import { readFileSync, writeFileSync } from "fs";

const files = [
  "src/app/api/settings/password/route.ts",
  "src/app/api/settings/profile/route.ts",
  "src/app/api/settings/avatar/route.ts",
  "src/app/api/settings/email/route.ts",
  "src/app/api/uploadthing/core.ts",
  "src/app/api/admin/users/[userId]/role/route.ts",
  "src/app/api/admin/users/[userId]/plan/route.ts",
  "src/app/api/admin/users/[userId]/storage/route.ts",
  "src/app/api/admins/route.ts",
  "src/app/api/print/route.ts",
  "src/app/api/blog/route.ts",
  "src/app/api/blog/categories/[categoryId]/route.ts",
  "src/app/api/blog/categories/route.ts",
  "src/app/api/blog/[postId]/route.ts",
  "src/app/api/files/[fileId]/move-to-queue/route.ts",
  "src/app/api/files/[fileId]/route.ts",
  "src/app/api/print-queue/[queueItemId]/reassign/route.ts",
  "src/app/api/print-queue/[queueItemId]/print/route.ts",
  "src/app/api/print-queue/[queueItemId]/route.ts",
  "src/app/api/notifications/mark-read/route.ts",
  "src/app/api/notifications/route.ts",
];

for (const file of files) {
  let content = readFileSync(file, "utf8");

  // Fix broken pattern from first script
  content = content.replace(
    /const token = await getAuthToken\(req\);\/\/REPLACED\nconst _unused = \{[\s\S]*?\}\);/g,
    `const token = await getAuthToken(req);`,
  );

  // Fix import if still old
  content = content.replace(
    `import { getToken } from "next-auth/jwt";`,
    `import { getAuthToken } from "@/lib/get-token";`,
  );

  // Fix any remaining old getToken pattern
  content = content.replace(
    /const token = await getToken\(\{[\s\S]*?req,[\s\S]*?secret: process\.env\.AUTH_SECRET,[\s\S]*?cookieName: ["'].*?["'],[\s\S]*?\}\);/g,
    `const token = await getAuthToken(req);`,
  );

  writeFileSync(file, content);
  console.log(`✅ Fixed: ${file}`);
}
