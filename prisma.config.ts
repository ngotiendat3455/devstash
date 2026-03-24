import "dotenv/config";

import { defineConfig } from "prisma/config";

const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
const shadowDatabaseUrl = process.env.SHADOW_DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  ...(migrationUrl
    ? {
        datasource: {
          url: migrationUrl,
          ...(shadowDatabaseUrl
            ? {
                shadowDatabaseUrl,
              }
            : {}),
        },
      }
    : {}),
});
