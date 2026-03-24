# Current Feature

## Feature Name

Dashboard Items

## Status

Completed

## Goals

- Replace the dummy pinned and recent item data shown in the main dashboard area with real Neon database data loaded through Prisma.
- Create `src/lib/db/items.ts` with item-focused data fetching helpers.
- Fetch dashboard items directly in a server component instead of `@src/lib/mock-data.ts`.
- Derive each item card icon and border styling from the item type.
- Display item type tags and preserve the current dashboard item card content.
- Update the collection stats display alongside the dashboard item data changes.

## Notes

- Source spec: `@context/features/dashboard-items-spec.md`
- UI reference: `@context/screenshots/dashboard-ui-main.png`
- Scope note: replace only the main dashboard pinned and recent item sections that currently use `@src/lib/mock-data.ts`.
- Empty-state note: if there are no pinned items, do not render the pinned items section.
- Data source note: keep the existing dashboard layout and card design while switching the data source to Prisma-backed Neon data.

## History

- 2026-03-25: Completed feature `Dashboard Items`
- 2026-03-25: Verified dashboard items with `npm run lint` and `npm run build`
- 2026-03-25: Implemented Prisma-backed pinned and recent dashboard items with server-side fetching in `/dashboard`
- 2026-03-25: Added `src/lib/db/items.ts` to load dashboard item cards, normalize type icons, and derive item accent colors
- 2026-03-25: Updated dashboard item cards to render Prisma data and revised collection card stats to show item counts
- 2026-03-25: Created branch `feature/dashboard-items`
- 2026-03-25: Set current feature to `Dashboard Items` and marked it `In Progress`
- 2026-03-25: Synced current feature goals with `context/features/dashboard-items-spec.md`
- 2026-03-24: Completed feature `Dashboard Collections`
- 2026-03-24: Verified dashboard collections with `npm run lint` and `npm run build`
- 2026-03-24: Implemented Prisma-backed dashboard collection cards with server-side fetching in `/dashboard`
- 2026-03-24: Added `src/lib/db/collections.ts` to load collection card data, derive accent colors, and expose type icons for the dashboard
- 2026-03-24: Created branch `feature/dashboard-collections`
- 2026-03-24: Set current feature to `Dashboard Collections` and marked it `In Progress`
- 2026-03-24: Synced current feature goals with `context/features/dashboard-collections-spec.md`
- 2026-03-24: Completed feature `Development Seed Data`
- 2026-03-24: Verified seed data changes with `npm run lint` and `npm run build`
- 2026-03-24: Replaced `prisma/seed.ts` with an idempotent demo seed for the user, system item types, collections, tags, and sample items
- 2026-03-24: Added `bcryptjs` as a direct dependency for password hashing in the seed script
- 2026-03-24: Set current feature to `Development Seed Data` and synced goals with `context/features/seed-spec.md`
- 2026-03-24: Completed feature `Prisma + Neon PostgreSQL Setup`
- 2026-03-24: Applied initial Prisma migration `20260324160402_init` with `prisma migrate dev`
- 2026-03-24: Verified migration state with `prisma migrate status`
- 2026-03-22: Verified Prisma setup changes with `npm run lint` and `npm run build`
- 2026-03-22: Implemented Prisma 7 configuration, initial schema, Neon adapter client setup, environment scaffolding, and seed script for system item types
- 2026-03-22: Created branch `feature/prisma-neon-setup`
- 2026-03-22: Set current feature to `Prisma + Neon PostgreSQL Setup` and marked it `In Progress`
- 2026-03-22: Synced current feature goals with `context/features/database-spec.md`
- 2026-03-22: Completed feature `Dashboard Phase 2`
- 2026-03-22: Feature goals included a responsive, collapsible dashboard sidebar that displays collections and item types
- 2026-03-22: Feature notes referenced `context/features/dashboard-phase-2-spec.md`
- 2026-03-22: Verified dashboard phase 2 with `npm run lint` and `npm run build`
- 2026-03-22: Implemented responsive and collapsible dashboard sidebar with collections and item types
- 2026-03-22: Created branch `feature/dashboard-phase-2`
- 2026-03-22: Set current feature to `Dashboard Phase 2` and marked it `In Progress`
- 2026-03-22: Synced current feature goals with `context/features/dashboard-phase-2-spec.md`
- 2026-03-22: Completed feature `Dashboard Phase 1`
- 2026-03-22: Feature goals included setup of shadcn/ui, creation of `/dashboard`, a dashboard layout with top bar, dark mode by default, and continued use of a single mock-data source
- 2026-03-22: Feature notes referenced `context/project-overview.md`, `context/screenshots/dashboard-ui-main.png`, and `context/features/dashboard-phase-1-spec.md`
- 2026-03-22: Started dashboard mock data source in `src/lib/mock-data.ts`
- 2026-03-22: Set current feature to Dashboard Phase 1 and marked it In Progress
- 2026-03-22: Synced current feature goals with `context/features/dashboard-phase-1-spec.md`
- 2026-03-22: Created branch `feature/dashboard-phase-1`
- 2026-03-22: Implemented `/dashboard`, dark mode defaults, and shadcn-style UI primitives
- 2026-03-22: Verified dashboard phase 1 with `npm run lint` and `npm run build`
