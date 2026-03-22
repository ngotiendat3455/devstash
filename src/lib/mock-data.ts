export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  isPro: boolean;
}

export interface MockItemType {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  isSystem: boolean;
  count: number;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string;
  itemTypeIds: string[];
  itemCount: number;
  isFavorite: boolean;
  accentColor: string;
}

export interface MockItem {
  id: string;
  title: string;
  description: string;
  typeId: string;
  collectionId: string;
  contentType: "text" | "file" | "url";
  content: string;
  language: string | null;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: string;
}

const currentUser: MockUser = {
  id: "user_01",
  name: "John Doe",
  email: "john@example.com",
  avatarUrl: null,
  isPro: true,
};

const itemTypes: MockItemType[] = [
  {
    id: "type_snippet",
    name: "Snippets",
    slug: "snippets",
    icon: "code-2",
    color: "blue",
    isSystem: true,
    count: 24,
  },
  {
    id: "type_prompt",
    name: "Prompts",
    slug: "prompts",
    icon: "sparkles",
    color: "violet",
    isSystem: true,
    count: 18,
  },
  {
    id: "type_command",
    name: "Commands",
    slug: "commands",
    icon: "terminal",
    color: "orange",
    isSystem: true,
    count: 15,
  },
  {
    id: "type_note",
    name: "Notes",
    slug: "notes",
    icon: "notebook-pen",
    color: "yellow",
    isSystem: true,
    count: 12,
  },
  {
    id: "type_file",
    name: "Files",
    slug: "files",
    icon: "file-text",
    color: "zinc",
    isSystem: true,
    count: 5,
  },
  {
    id: "type_image",
    name: "Images",
    slug: "images",
    icon: "image",
    color: "pink",
    isSystem: true,
    count: 3,
  },
  {
    id: "type_url",
    name: "Links",
    slug: "links",
    icon: "link",
    color: "emerald",
    isSystem: true,
    count: 8,
  },
];

const collections: MockCollection[] = [
  {
    id: "collection_react-patterns",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    itemTypeIds: ["type_snippet", "type_note", "type_url"],
    itemCount: 12,
    isFavorite: true,
    accentColor: "blue",
  },
  {
    id: "collection_python-snippets",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    itemTypeIds: ["type_snippet", "type_note"],
    itemCount: 8,
    isFavorite: false,
    accentColor: "blue",
  },
  {
    id: "collection_context-files",
    name: "Context Files",
    description: "AI context files for projects",
    itemTypeIds: ["type_file", "type_note"],
    itemCount: 5,
    isFavorite: true,
    accentColor: "zinc",
  },
  {
    id: "collection_interview-prep",
    name: "Interview Prep",
    description: "Technical interview preparation",
    itemTypeIds: ["type_note", "type_snippet", "type_url", "type_prompt"],
    itemCount: 24,
    isFavorite: false,
    accentColor: "yellow",
  },
  {
    id: "collection_git-commands",
    name: "Git Commands",
    description: "Frequently used git commands",
    itemTypeIds: ["type_command", "type_note"],
    itemCount: 15,
    isFavorite: true,
    accentColor: "orange",
  },
  {
    id: "collection_ai-prompts",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    itemTypeIds: ["type_prompt", "type_url", "type_note"],
    itemCount: 18,
    isFavorite: false,
    accentColor: "violet",
  },
];

const items: MockItem[] = [
  {
    id: "item_use-auth-hook",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    typeId: "type_snippet",
    collectionId: "collection_react-patterns",
    contentType: "text",
    content:
      "export function useAuth() { /* wraps session state and auth actions */ }",
    language: "typescript",
    tags: ["react", "auth", "hooks"],
    isFavorite: true,
    isPinned: true,
    updatedAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "item_api-error-handling",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    typeId: "type_snippet",
    collectionId: "collection_react-patterns",
    contentType: "text",
    content:
      "export async function apiRequest() { /* standardized retries and error mapping */ }",
    language: "typescript",
    tags: ["api", "error-handling", "fetch"],
    isFavorite: false,
    isPinned: true,
    updatedAt: "2026-01-12T09:00:00.000Z",
  },
  {
    id: "item_python-dict-merge",
    title: "Dictionary Merge Helper",
    description: "Merge nested dictionaries without mutating the source",
    typeId: "type_snippet",
    collectionId: "collection_python-snippets",
    contentType: "text",
    content: "def deep_merge(base, override): ...",
    language: "python",
    tags: ["python", "utilities"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: "item_project-context-template",
    title: "Project Context Template",
    description: "Starter context file for AI-assisted feature work",
    typeId: "type_file",
    collectionId: "collection_context-files",
    contentType: "file",
    content: "/files/project-context-template.md",
    language: null,
    tags: ["context", "ai", "workflow"],
    isFavorite: true,
    isPinned: false,
    updatedAt: "2026-01-09T09:00:00.000Z",
  },
  {
    id: "item_behavioral-story-bank",
    title: "Behavioral Story Bank",
    description: "STAR stories for leadership and delivery questions",
    typeId: "type_note",
    collectionId: "collection_interview-prep",
    contentType: "text",
    content: "Keep concise STAR examples for impact, conflict, and ownership.",
    language: null,
    tags: ["interview", "behavioral"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-01-08T09:00:00.000Z",
  },
  {
    id: "item_git-rebase-cheatsheet",
    title: "Git Rebase Cheatsheet",
    description: "Interactive rebase commands for cleanup before review",
    typeId: "type_command",
    collectionId: "collection_git-commands",
    contentType: "text",
    content: "git rebase -i HEAD~5",
    language: "bash",
    tags: ["git", "cli", "workflow"],
    isFavorite: true,
    isPinned: false,
    updatedAt: "2026-01-07T09:00:00.000Z",
  },
  {
    id: "item_code-review-prompt",
    title: "Code Review Prompt",
    description: "Prompt template for focused bug and regression reviews",
    typeId: "type_prompt",
    collectionId: "collection_ai-prompts",
    contentType: "text",
    content:
      "Review this change for correctness, regressions, and missing test coverage.",
    language: null,
    tags: ["ai", "prompt", "review"],
    isFavorite: true,
    isPinned: false,
    updatedAt: "2026-01-06T09:00:00.000Z",
  },
  {
    id: "item_nextjs-app-router-guide",
    title: "Next.js App Router Guide",
    description: "Reference link for nested layouts and server components",
    typeId: "type_url",
    collectionId: "collection_react-patterns",
    contentType: "url",
    content: "https://nextjs.org/docs/app",
    language: null,
    tags: ["nextjs", "docs"],
    isFavorite: false,
    isPinned: false,
    updatedAt: "2026-01-05T09:00:00.000Z",
  },
];

export const mockData = {
  currentUser,
  itemTypes,
  collections,
  items,
} as const;

