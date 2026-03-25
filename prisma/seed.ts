import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import { hash } from "bcryptjs";

import { ItemContentType, PrismaClient } from "../src/generated/prisma/client";

const DEMO_USER = {
  email: "demo@devstash.io",
  name: "Demo User",
  password: "12345678",
  isPro: false,
} as const;

const SYSTEM_ITEM_TYPES = [
  { name: "Snippet", slug: "snippets", icon: "Code", color: "#3b82f6" },
  { name: "Prompt", slug: "prompts", icon: "Sparkles", color: "#8b5cf6" },
  { name: "Command", slug: "commands", icon: "Terminal", color: "#f97316" },
  { name: "Note", slug: "notes", icon: "StickyNote", color: "#fde047" },
  { name: "File", slug: "files", icon: "File", color: "#6b7280" },
  { name: "Image", slug: "images", icon: "Image", color: "#ec4899" },
  { name: "Link", slug: "links", icon: "Link", color: "#10b981" },
] as const;

type SeedItem = {
  title: string;
  description: string;
  typeSlug: (typeof SYSTEM_ITEM_TYPES)[number]["slug"];
  contentType: ItemContentType;
  content?: string;
  url?: string;
  language?: string;
  tags: string[];
  isFavorite?: boolean;
  isPinned?: boolean;
};

type SeedCollection = {
  name: string;
  description: string;
  isFavorite?: boolean;
  items: SeedItem[];
};

const SAMPLE_COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    isFavorite: true,
    items: [
      {
        title: "useDebounce and useLocalStorage Hooks",
        description: "Two reusable hooks for debounced state updates and persistent local state.",
        typeSlug: "snippets",
        contentType: ItemContentType.TEXT,
        language: "typescript",
        tags: ["react", "hooks", "typescript"],
        isPinned: true,
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);

    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    const rawValue = window.localStorage.getItem(key);

    return rawValue ? (JSON.parse(rawValue) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}`,
      },
      {
        title: "Context Provider and Compound Component Pattern",
        description: "A typed pattern for sharing state across related UI primitives.",
        typeSlug: "snippets",
        contentType: ItemContentType.TEXT,
        language: "typescript",
        tags: ["react", "context", "components"],
        isFavorite: true,
        content: `import { createContext, useContext, useState, type ReactNode } from "react";

type TabsContextValue = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;
}

export function useTabs() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("useTabs must be used within <Tabs />");
  }

  return context;
}`,
      },
      {
        title: "Class Name and Grouping Utilities",
        description: "Small utilities for class composition and list grouping.",
        typeSlug: "snippets",
        contentType: ItemContentType.TEXT,
        language: "typescript",
        tags: ["typescript", "utilities", "helpers"],
        content: `export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function groupBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const key = getKey(item);
    groups[key] ??= [];
    groups[key].push(item);
    return groups;
  }, {});
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    items: [
      {
        title: "Code Review Prompt",
        description: "Prompt template for correctness, regressions, and test coverage checks.",
        typeSlug: "prompts",
        contentType: ItemContentType.TEXT,
        tags: ["ai", "review", "quality"],
        isFavorite: true,
        content: `Review this code change as a senior engineer.

Focus on:
- correctness and edge cases
- regressions or breaking behavior
- performance and security risks
- missing test coverage

Return findings first, ordered by severity, with file references.`,
      },
      {
        title: "Documentation Generation Prompt",
        description: "Prompt for producing concise technical documentation from source code.",
        typeSlug: "prompts",
        contentType: ItemContentType.TEXT,
        tags: ["ai", "documentation", "writing"],
        content: `Generate developer-facing documentation for this feature.

Include:
- purpose and scope
- how it works at a high level
- key inputs and outputs
- setup or usage examples
- known limitations

Keep it concise and practical.`,
      },
      {
        title: "Refactoring Assistant Prompt",
        description: "Prompt for extracting safer, incremental refactor plans.",
        typeSlug: "prompts",
        contentType: ItemContentType.TEXT,
        tags: ["ai", "refactor", "planning"],
        content: `You are helping with a refactor of an existing codebase.

Analyze the current implementation and propose:
1. the smallest safe refactor steps
2. behavior that must remain unchanged
3. risks to verify after each step
4. tests that should be added or updated

Do not suggest unrelated cleanup.`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        title: "Multi-stage Node Dockerfile",
        description: "Production-oriented Dockerfile for Next.js or Node services.",
        typeSlug: "snippets",
        contentType: ItemContentType.TEXT,
        language: "dockerfile",
        tags: ["docker", "devops", "deployment"],
        content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
CMD ["npm", "start"]`,
      },
      {
        title: "Deploy Current Branch",
        description: "Minimal deployment command sequence for a production build rollout.",
        typeSlug: "commands",
        contentType: ItemContentType.TEXT,
        language: "bash",
        tags: ["deployment", "cli", "release"],
        content: `git fetch origin
git checkout main
git pull --ff-only
npm ci
npm run build`,
      },
      {
        title: "Docker Compose Reference",
        description: "Official Compose file reference for service orchestration.",
        typeSlug: "links",
        contentType: ItemContentType.URL,
        url: "https://docs.docker.com/reference/compose-file/",
        tags: ["docker", "docs", "compose"],
      },
      {
        title: "GitHub Actions Documentation",
        description: "Reference for CI workflows and reusable automation.",
        typeSlug: "links",
        contentType: ItemContentType.URL,
        url: "https://docs.github.com/actions",
        tags: ["github", "ci", "docs"],
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    isFavorite: true,
    items: [
      {
        title: "Git Cleanup and Sync",
        description: "Fetch remotes, prune stale refs, and fast-forward the current branch.",
        typeSlug: "commands",
        contentType: ItemContentType.TEXT,
        language: "bash",
        tags: ["git", "workflow", "cleanup"],
        isPinned: true,
        content: `git fetch --all --prune
git status
git pull --ff-only`,
      },
      {
        title: "Docker Container Inspection",
        description: "List active containers and follow logs from a selected service.",
        typeSlug: "commands",
        contentType: ItemContentType.TEXT,
        language: "bash",
        tags: ["docker", "containers", "debugging"],
        content: `docker ps
docker logs -f <container-name>`,
      },
      {
        title: "Process Management Cheatsheet",
        description: "Find a process by port and terminate it when local dev gets stuck.",
        typeSlug: "commands",
        contentType: ItemContentType.TEXT,
        language: "bash",
        tags: ["processes", "ports", "debugging"],
        content: `lsof -i :3000
kill -9 <pid>`,
      },
      {
        title: "Package Manager Utilities",
        description: "Quick dependency install, audit, and outdated checks.",
        typeSlug: "commands",
        contentType: ItemContentType.TEXT,
        language: "bash",
        tags: ["npm", "packages", "maintenance"],
        content: `npm install
npm audit
npm outdated`,
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        title: "Tailwind CSS Documentation",
        description: "Core reference for utility classes and theme configuration.",
        typeSlug: "links",
        contentType: ItemContentType.URL,
        url: "https://tailwindcss.com/docs",
        tags: ["tailwind", "css", "docs"],
      },
      {
        title: "shadcn/ui Component Library",
        description: "Composable component examples and installation docs.",
        typeSlug: "links",
        contentType: ItemContentType.URL,
        url: "https://ui.shadcn.com/",
        tags: ["components", "ui", "react"],
      },
      {
        title: "Material Design 3",
        description: "Design system guidance for hierarchy, color, and motion.",
        typeSlug: "links",
        contentType: ItemContentType.URL,
        url: "https://m3.material.io/",
        tags: ["design-system", "ux", "reference"],
      },
      {
        title: "Lucide Icon Library",
        description: "Icon reference used throughout modern React dashboards.",
        typeSlug: "links",
        contentType: ItemContentType.URL,
        url: "https://lucide.dev/icons/",
        tags: ["icons", "design", "resources"],
      },
    ],
  },
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

function getRequiredId(map: Map<string, string>, key: string, label: string) {
  const value = map.get(key);

  if (!value) {
    throw new Error(`Missing ${label} for "${key}".`);
  }

  return value;
}

async function main() {
  const prisma = createPrismaClient();

  try {
    const passwordHash = await hash(DEMO_USER.password, 12);

    const demoUser = await prisma.user.upsert({
      where: { email: DEMO_USER.email },
      update: {
        name: DEMO_USER.name,
        password: passwordHash,
        isPro: DEMO_USER.isPro,
        emailVerified: new Date(),
      },
      create: {
        email: DEMO_USER.email,
        name: DEMO_USER.name,
        password: passwordHash,
        isPro: DEMO_USER.isPro,
        emailVerified: new Date(),
      },
    });

    await prisma.$transaction([
      prisma.item.deleteMany({ where: { userId: demoUser.id } }),
      prisma.collection.deleteMany({ where: { userId: demoUser.id } }),
      prisma.tag.deleteMany({ where: { userId: demoUser.id } }),
      prisma.itemType.deleteMany({ where: { userId: demoUser.id } }),
    ]);

    const itemTypeIds = new Map<string, string>();

    for (const itemType of SYSTEM_ITEM_TYPES) {
      const record = await prisma.itemType.upsert({
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

      itemTypeIds.set(itemType.slug, record.id);
    }

    const collectionIds = new Map<string, string>();

    for (const collection of SAMPLE_COLLECTIONS) {
      const record = await prisma.collection.upsert({
        where: {
          userId_name: {
            userId: demoUser.id,
            name: collection.name,
          },
        },
        update: {
          description: collection.description,
          isFavorite: collection.isFavorite ?? false,
        },
        create: {
          name: collection.name,
          description: collection.description,
          isFavorite: collection.isFavorite ?? false,
          userId: demoUser.id,
        },
      });

      collectionIds.set(collection.name, record.id);
    }

    const allTagNames = new Set<string>();

    for (const collection of SAMPLE_COLLECTIONS) {
      for (const item of collection.items) {
        for (const tag of item.tags) {
          allTagNames.add(tag);
        }
      }
    }

    const tagIds = new Map<string, string>();

    for (const tagName of allTagNames) {
      const record = await prisma.tag.upsert({
        where: {
          userId_name: {
            userId: demoUser.id,
            name: tagName,
          },
        },
        update: {},
        create: {
          name: tagName,
          userId: demoUser.id,
        },
      });

      tagIds.set(tagName, record.id);
    }

    let itemCount = 0;

    for (const collection of SAMPLE_COLLECTIONS) {
      const collectionId = getRequiredId(collectionIds, collection.name, "collection id");

      for (const item of collection.items) {
        await prisma.item.create({
          data: {
            title: item.title,
            description: item.description,
            contentType: item.contentType,
            content: item.content,
            url: item.url,
            language: item.language,
            isFavorite: item.isFavorite ?? false,
            isPinned: item.isPinned ?? false,
            userId: demoUser.id,
            typeId: getRequiredId(itemTypeIds, item.typeSlug, "item type id"),
            collectionId,
            tags: {
              create: item.tags.map((tagName) => ({
                tagId: getRequiredId(tagIds, tagName, "tag id"),
              })),
            },
          },
        });

        itemCount += 1;
      }
    }

    console.log(
      `Seeded ${SYSTEM_ITEM_TYPES.length} system item types, ${SAMPLE_COLLECTIONS.length} collections, ${itemCount} items, and ${tagIds.size} tags for ${DEMO_USER.email}.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Seeding failed.", error);
  process.exitCode = 1;
});
