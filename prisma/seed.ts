import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = [
    { name: "General", slug: "general" },
    { name: "Tips", slug: "tips" },
    { name: "News", slug: "news" },
    { name: "Updates", slug: "updates" },
  ];

  for (const category of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("✅ Default categories seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
