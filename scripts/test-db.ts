import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "../src/generated/prisma/client";

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }

  return new PrismaClient({
    adapter: new PrismaNeon({ connectionString: databaseUrl }),
  });
}

async function main() {
  const prisma = createPrismaClient();

  try {
    const result = await prisma.$queryRaw<Array<{ now: Date }>>`SELECT NOW() AS now`;
    const [userCount, itemTypeCount, collectionCount, itemCount, tagCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.itemType.count(),
        prisma.collection.count(),
        prisma.item.count(),
        prisma.tag.count(),
      ]);

    console.log("Database connection OK");
    console.log(`Server time: ${result[0]?.now.toISOString() ?? "unknown"}`);
    console.log(`Users: ${userCount}`);
    console.log(`Item types: ${itemTypeCount}`);
    console.log(`Collections: ${collectionCount}`);
    console.log(`Items: ${itemCount}`);
    console.log(`Tags: ${tagCount}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Database test failed.", error);
  process.exitCode = 1;
});
