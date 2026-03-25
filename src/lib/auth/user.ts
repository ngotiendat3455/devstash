export function getUserInitials(name: string | null | undefined, email?: string | null) {
  const trimmedName = name?.trim();

  if (trimmedName) {
    const parts = trimmedName.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }

  const fallback = email?.trim() ?? "";

  return fallback.slice(0, 2).toUpperCase() || "DU";
}
