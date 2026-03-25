# Item CRUD Architecture

## Overview

DevStash should implement item CRUD as one unified system built around the existing `Item`, `ItemType`, `Collection`, `Tag`, and `ItemTag` Prisma models.

The core idea is:

- one dynamic route for browsing and editing items by type: `/items/[type]`
- one action file for all item mutations
- query helpers in `src/lib/db`
- shared item components that adapt by item type and `contentType`
- type-specific behavior kept in components and field config, not duplicated in mutations

This matches the project’s current direction:

- server components fetch directly from `lib/db`
- mutations should be centralized and validated
- item types are metadata-driven through `ItemType.slug`, `ItemType.icon`, and `ItemType.color`

## Current Data Model Constraints

The existing Prisma schema already supports a unified CRUD system:

- `Item` is the single record for all saved content
- `Item.typeId` points to `ItemType`
- `Item.contentType` controls storage mode: `TEXT`, `FILE`, or `URL`
- `Item` has optional storage fields for all modes:
  - `content`
  - `fileUrl`
  - `fileName`
  - `fileSize`
  - `url`
- `Item.collectionId` is optional, so items can exist with or without a collection
- tags are normalized through `Tag` and `ItemTag`

That means the app does not need separate snippet, prompt, note, command, file, image, or link tables. The differences belong in configuration and UI rendering.

## Canonical Type Mapping

The current type definitions come from `prisma/seed.ts` and the research in `docs/item-types.md`. The prompt references `docs/content-types.md` and `src/lib/constants.tsx`, but those files do not exist in the current repo.

Recommended canonical metadata source for CRUD:

- `src/lib/items/item-types.ts`

This file should define:

- the allowed system type slugs
- the display label for each slug
- the storage classification for each slug
- icon and color metadata if the UI needs a shared source
- a small set of field rules used by the form layer

Example responsibilities:

- map `snippets`, `prompts`, `notes`, `commands` to `TEXT`
- map `files`, `images` to `FILE`
- map `links` to `URL`
- expose helpers like `isTextItemType(slug)` and `getItemTypeConfig(slug)`

## Recommended File Structure

```text
src/
  actions/
    items.ts
  app/
    items/
      [type]/
        page.tsx
        loading.tsx
        error.tsx
  components/
    items/
      ItemPageShell.tsx
      ItemList.tsx
      ItemCard.tsx
      ItemEditorSheet.tsx
      ItemDeleteDialog.tsx
      ItemTypePageHeader.tsx
      forms/
        ItemForm.tsx
        ItemFormFields.tsx
        TextItemFields.tsx
        FileItemFields.tsx
        UrlItemFields.tsx
      display/
        ItemContentPreview.tsx
        TextItemPreview.tsx
        FileItemPreview.tsx
        UrlItemPreview.tsx
  lib/
    db/
      items.ts
      item-types.ts
    validation/
      items.ts
  types/
    items.ts
```

## Mutations

## `src/actions/items.ts`

All item mutations should live in one action file:

- `createItem`
- `updateItem`
- `deleteItem`
- optional lightweight mutations later:
  - `toggleItemFavorite`
  - `toggleItemPinned`

Reasons to centralize mutations:

- shared auth checks
- shared type resolution
- shared validation
- shared tag upsert logic
- shared cache revalidation
- less duplication between item types

Each action should:

1. authenticate the user
2. validate the input with Zod
3. resolve the item type from the incoming slug or type id
4. derive the correct `contentType` from the type config
5. normalize the payload so only the relevant storage fields are set
6. perform the Prisma write
7. revalidate `/dashboard` and `/items/[type]`
8. return a typed `{ success, data, error }` result

## Why Type-Specific Logic Should Not Live In Actions

The action layer should only care about:

- who owns the item
- which `ItemType` is being used
- which `contentType` storage shape is valid
- which fields must be persisted

It should not care about UI details like:

- which editor layout to show
- whether a snippet uses a code editor
- whether a prompt gets markdown help text
- whether an image shows a thumbnail preview

Those are component concerns. Keeping them out of actions prevents seven slightly different mutation flows from drifting apart.

## Query Layer

## `src/lib/db/items.ts`

This repo already uses `src/lib/db/items.ts` for server-side item queries and type metadata used by the dashboard. The CRUD system should extend that pattern instead of introducing API routes for standard reads.

Recommended queries:

- `getItemTypeBySlug(slug)`
- `getItemPageData(userEmail, typeSlug)`
- `getItemsByType(userEmail, typeSlug, options)`
- `getItemById(userId, itemId)`
- `getItemEditorData(userId, itemId)`
- `getItemFormOptions(userId)`

`getItemPageData()` should return everything needed by `/items/[type]` in one server-component fetch:

- resolved item type
- page title and description
- item list for that type
- collection options
- tag suggestions if needed later
- sidebar data if that route shares the dashboard shell

This matches the current pattern in `src/app/dashboard/page.tsx`, where server components call `lib/db` helpers directly.

## Routing

## `/items/[type]`

The route parameter should be the `ItemType.slug`:

- `/items/snippets`
- `/items/prompts`
- `/items/notes`
- `/items/commands`
- `/items/files`
- `/items/images`
- `/items/links`

How the route should work:

1. read `params.type`
2. authenticate the user
3. resolve the slug against system item types
4. return `notFound()` if the slug is unknown or unavailable
5. call `getItemPageData(userEmail, params.type)`
6. render shared components with the resolved type config

This fits the existing sidebar implementation in `src/lib/db/items.ts`, which already builds item type links as `/items/${itemType.slug}`.

## Component Responsibilities

## Route-level components

- `page.tsx`
  - server component
  - resolves auth and route params
  - fetches page data from `lib/db`
  - passes normalized data to presentational components

- `ItemPageShell`
  - top-level layout for the item type page
  - renders header, toolbar, filters, list, and editor trigger

- `ItemTypePageHeader`
  - displays type name, icon, accent color, count, and CTA buttons

## List and card components

- `ItemList`
  - renders empty state or list/grid of items
  - handles selected item state if editing happens in a drawer or sheet

- `ItemCard`
  - shared card for all types
  - shows common metadata:
    - title
    - description
    - tags
    - favorite/pinned state
    - updated time
  - delegates content preview to a type-aware preview component

- `ItemContentPreview`
  - switches by `contentType`
  - renders:
    - `TextItemPreview`
    - `FileItemPreview`
    - `UrlItemPreview`

## Editor components

- `ItemEditorSheet`
  - shared create/edit container
  - opens from the list page
  - owns form submission state
  - calls `createItem` or `updateItem`

- `ItemForm`
  - shared form wrapper
  - renders common fields plus the appropriate specialized field block

- `ItemFormFields`
  - renders common fields:
    - `title`
    - `description`
    - `collectionId`
    - `tags`
    - `isFavorite`
    - `isPinned`
    - `language` when relevant

- `TextItemFields`
  - body input for snippet, prompt, note, and command
  - code-oriented UI can vary by slug, but still persists through `content`

- `FileItemFields`
  - upload or file picker UI for file and image
  - persists `fileUrl`, `fileName`, and `fileSize`

- `UrlItemFields`
  - URL input and external-link preview for link items
  - persists `url`

- `ItemDeleteDialog`
  - confirms destructive delete
  - calls `deleteItem`

## Type-Specific Logic Placement

Type-specific logic should live in:

- `src/lib/items/item-types.ts` for static metadata and rules
- specialized form field components for editing
- specialized preview components for display

Type-specific logic should not live in:

- Prisma schema branching
- separate mutation files per item type
- separate routes per item type

That split keeps behavior clear:

- persistence rules live in one place
- route behavior stays generic
- rendering differences stay in the UI layer

## Suggested Validation Shape

Use one shared validation module:

- `src/lib/validation/items.ts`

Recommended structure:

- `baseItemSchema`
- `textItemSchema`
- `fileItemSchema`
- `urlItemSchema`
- `createItemSchema`
- `updateItemSchema`

Validation should enforce:

- text types require `content`
- file/image types require file metadata
- link types require a valid `url`
- only allowed system slugs are accepted

The action can select the proper schema after resolving the type slug.

## Data Flow

Recommended end-to-end flow for create/update:

1. user opens `/items/[type]`
2. server component fetches page data from `lib/db/items.ts`
3. user opens shared editor UI
4. form chooses fields based on the resolved type config
5. submit calls action in `src/actions/items.ts`
6. action validates, persists, and revalidates
7. route refreshes with updated item list

Recommended delete flow:

1. user clicks delete from item card or editor
2. `ItemDeleteDialog` confirms intent
3. `deleteItem` verifies ownership and removes the item
4. related pages revalidate

## Notes On Existing Repo Alignment

This architecture intentionally follows current repo conventions:

- `src/lib/db/items.ts` already contains item-type ordering, icon normalization, and sidebar route generation
- `src/app/dashboard/page.tsx` already uses direct server-component data fetching from `lib/db`
- Prisma already models all item variants in a single `Item` table
- the project overview already expects `/items/[type]` style routing

The main missing pieces are:

- the actual `/items/[type]` route
- shared item components under `src/components/items`
- unified mutation actions in `src/actions/items.ts`
- a dedicated validation module for item forms
- a canonical shared type-config file to replace stale references to `constants.tsx`

## Sources

- `context/project-overview.md`
- `docs/item-types.md`
- `prisma/schema.prisma`
- `src/app/dashboard/page.tsx`
- `src/lib/db/items.ts`
- `src/lib/db/collections.ts`
- `src/lib/mock-data.ts`
