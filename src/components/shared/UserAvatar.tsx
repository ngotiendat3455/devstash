import Image from "next/image";

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  className?: string;
  fallback: string;
  image?: string | null;
}

export function UserAvatar({ className, fallback, image }: UserAvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/90 font-semibold text-slate-950",
        className,
      )}
    >
      {image ? (
        <Image
          src={image}
          alt="User avatar"
          fill
          sizes="64px"
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}
