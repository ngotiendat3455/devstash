import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "../src/generated/prisma/client";

const SYSTEM_ITEM_TYPES = [
  { name: "Snippet", slug: "snippets", icon: "code-2", color: "blue" },
  { name: "Prompt", slug: "prompts", icon: "sparkles", color: "violet" },
  { name: "Command", slug: "commands", icon: "terminal", color: "orange" },
  { name: "Note", slug: "notes", icon: "notebook-pen", color: "yellow" },
  { name: "File", slug: "files", icon: "file-text", color: "zinc" },
  { name: "Image", slug: "images", icon: "image", color: "pink" },
  { name: "URL", slug: "links", icon: "link", color: "emerald" },
] as const;

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to run the Prisma seed.");
  }

  return new PrismaClient({
    adapter: new PrismaNeon({ connectionString: databaseUrl }),
  });
}

async function main() {
  const prisma = createPrismaClient();

  try {
    for (const itemType of SYSTEM_ITEM_TYPES) {
      await prisma.itemType.upsert({
        where: { slug: itemType.slug },
        update: {
          name: itemType.name,
          icon: itemType.icon,
          color: itemType.color,
          isSystem: true,
        },
        create: {
          name: itemType.name,
          slug: itemType.slug,
          icon: itemType.icon,
          color: itemType.color,
          isSystem: true,
        },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Seeding failed.", error);
  process.exitCode = 1;
});
