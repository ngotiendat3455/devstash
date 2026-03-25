# Item Types

## Overview

DevStash has 7 built-in system item types:

- Snippet
- Prompt
- Note
- Command
- File
- Image
- Link

These types are stored in the `ItemType` model with a unique `slug`, optional `icon`, optional `color`, and `isSystem` flag. Each item belongs to one item type through `Item.typeId`.

## Canonical System Types

The current canonical source for system item types is `prisma/seed.ts`. The research prompt references `src/lib/constants.tsx`, but that file no longer exists. The closest current equivalents are:

- `prisma/seed.ts` for source-of-truth names, slugs, icons, and hex colors
- `src/lib/mock-data.ts` for earlier UI-facing mock labels/icons/colors
- `src/lib/db/items.ts` for current dashboard icon normalization and accent color mapping

| Type | Slug | Seed icon | Dashboard icon | Hex color | Dashboard accent | Purpose | Content classification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Snippet | `snippets` | `Code` | `code-2` | `#3b82f6` | `blue` | Save reusable code examples and implementation patterns. | `TEXT` |
| Prompt | `prompts` | `Sparkles` | `sparkles` | `#8b5cf6` | `violet` | Save reusable AI prompts and workflow instructions. | `TEXT` |
| Command | `commands` | `Terminal` | `terminal` | `#f97316` | `orange` | Save terminal or shell command references. | `TEXT` |
| Note | `notes` | `StickyNote` | `notebook-pen` | `#fde047` | `yellow` | Save plain written notes, documentation, or lightweight knowledge capture. | `TEXT` |
| File | `files` | `File` | `file-text` | `#6b7280` | `zinc` | Save uploaded files or file-backed resources. | `FILE` |
| Image | `images` | `Image` | `image` | `#ec4899` | `pink` | Save uploaded visual assets such as screenshots or reference images. | `FILE` |
| Link | `links` | `Link` | `link` | `#10b981` | `emerald` | Save external URLs and web references. | `URL` |

## Per-Type Details

### Snippet

- Name: `Snippet`
- Slug: `snippets`
- Icon: `Code`
- Hex color: `#3b82f6`
- Purpose: reusable code blocks, helpers, patterns, and examples
- Key fields used:
  - `title`
  - `description`
  - `contentType = TEXT`
  - `content`
  - `language`
  - `typeId`
  - `collectionId`
  - `isFavorite`
  - `isPinned`

### Prompt

- Name: `Prompt`
- Slug: `prompts`
- Icon: `Sparkles`
- Hex color: `#8b5cf6`
- Purpose: AI prompts, writing prompts, review prompts, and workflow templates
- Key fields used:
  - `title`
  - `description`
  - `contentType = TEXT`
  - `content`
  - `typeId`
  - `collectionId`
  - `isFavorite`
  - `isPinned`

### Note

- Name: `Note`
- Slug: `notes`
- Icon: `StickyNote`
- Hex color: `#fde047`
- Purpose: general text notes, short documentation, and knowledge capture
- Key fields used:
  - `title`
  - `description`
  - `contentType = TEXT`
  - `content`
  - `typeId`
  - `collectionId`
  - `isFavorite`
  - `isPinned`

### Command

- Name: `Command`
- Slug: `commands`
- Icon: `Terminal`
- Hex color: `#f97316`
- Purpose: shell commands, CLI sequences, and operational runbooks
- Key fields used:
  - `title`
  - `description`
  - `contentType = TEXT`
  - `content`
  - `language`
  - `typeId`
  - `collectionId`
  - `isFavorite`
  - `isPinned`

### File

- Name: `File`
- Slug: `files`
- Icon: `File`
- Hex color: `#6b7280`
- Purpose: uploaded documents, templates, and file-backed project resources
- Key fields used:
  - `title`
  - `description`
  - `contentType = FILE`
  - `fileUrl`
  - `fileName`
  - `fileSize`
  - `typeId`
  - `collectionId`
  - `isFavorite`
  - `isPinned`

### Image

- Name: `Image`
- Slug: `images`
- Icon: `Image`
- Hex color: `#ec4899`
- Purpose: screenshots, diagrams, references, and other uploaded visuals
- Key fields used:
  - `title`
  - `description`
  - `contentType = FILE`
  - `fileUrl`
  - `fileName`
  - `fileSize`
  - `typeId`
  - `collectionId`
  - `isFavorite`
  - `isPinned`

### Link

- Name: `Link`
- Slug: `links`
- Icon: `Link`
- Hex color: `#10b981`
- Purpose: saved external resources, docs, tools, and references
- Key fields used:
  - `title`
  - `description`
  - `contentType = URL`
  - `url`
  - `typeId`
  - `collectionId`
  - `isFavorite`
  - `isPinned`

## Content Classification Summary

The Prisma enum `ItemContentType` has 3 storage classifications:

- `TEXT`
- `FILE`
- `URL`

The 7 system item types map to those 3 classifications like this:

| Classification | Item types | Primary payload fields |
| --- | --- | --- |
| `TEXT` | Snippet, Prompt, Note, Command | `content`, optional `language` |
| `FILE` | File, Image | `fileUrl`, `fileName`, `fileSize` |
| `URL` | Link | `url` |

## Shared Properties

All items share the same base item record in the `Item` model:

- `id`
- `title`
- `description`
- `contentType`
- `typeId`
- `userId`
- `collectionId`
- `isFavorite`
- `isPinned`
- `createdAt`
- `updatedAt`

All item types also support tags indirectly through the `ItemTag` join table.

## Display Differences

The main display differences between item types are driven by their item type metadata rather than separate models:

- Visual identity comes from `ItemType.icon` and `ItemType.color`
- Dashboard display normalizes icons through `normalizeDashboardIconName()`
- Dashboard accent colors are derived from slug via `getDashboardAccentColor()`
- Sidebar ordering is hard-coded in `src/lib/db/items.ts`
- Profile breakdown ordering is separately hard-coded in `src/lib/db/profile.ts`

Behavioral differences are mostly based on `contentType`:

- `TEXT` items render body content from `content`
- `FILE` items are expected to render/download uploaded assets from `fileUrl`
- `URL` items point to external resources through `url`

## Product Notes

- The project overview defines these 7 types as built-in system item types.
- Custom item types are allowed for Pro users.
- The overview also marks file uploads and custom types as Pro functionality.
- The dashboard currently treats `files` and `images` as Pro-only sidebar item types.

## Sources

- `context/project-overview.md`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/lib/mock-data.ts`
- `src/lib/db/items.ts`
- `src/lib/db/profile.ts`
