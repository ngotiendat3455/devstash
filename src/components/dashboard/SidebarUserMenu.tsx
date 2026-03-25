"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronUp, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";

import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import type { DashboardSidebarUserData } from "@/lib/db/items";
import { cn } from "@/lib/utils";

interface SidebarUserMenuProps {
  collapsed: boolean;
  user: DashboardSidebarUserData;
}

export function SidebarUserMenu({ collapsed, user }: SidebarUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
        <Link
          href="/profile"
          title={user.name}
          className={cn(
            "group flex min-w-0 items-center transition",
            collapsed ? "justify-center" : "flex-1 gap-3",
          )}
        >
          <UserAvatar className="size-10 text-sm" fallback={user.initials} image={user.image} />
          {!collapsed ? (
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-sm font-medium text-white transition group-hover:text-sky-200">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          ) : null}
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 rounded-full"
          aria-label={isOpen ? "Close user menu" : "Open user menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <ChevronUp className={cn("size-4 transition", isOpen ? "rotate-180" : "")} />
        </Button>
      </div>

      {isOpen ? (
        <div
          className={cn(
            "absolute bottom-full z-30 mb-3 w-52 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-xl shadow-slate-950/30 backdrop-blur",
            collapsed ? "left-1/2 -translate-x-1/2" : "right-0",
          )}
        >
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <User className="size-4 text-slate-400" />
            Profile
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
          >
            <LogOut className="size-4 text-slate-400" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
