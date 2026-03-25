import Link from "next/link";
import { Command } from "lucide-react";

interface AuthShellProps {
  children: React.ReactNode;
  subtitle: string;
  title: string;
}

export function AuthShell({ children, subtitle, title }: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_32%),linear-gradient(180deg,_rgba(2,6,23,1),_rgba(15,23,42,1))] px-4 py-10 sm:px-6">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
      <div className="relative z-10 w-full max-w-md space-y-6">
        <Link href="/" className="inline-flex items-center gap-3 text-white">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30">
            <Command className="size-5" />
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight">DevStash</span>
            <span className="block text-sm text-slate-400">Developer knowledge hub</span>
          </span>
        </Link>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur xl:p-8">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
            <p className="text-sm leading-6 text-slate-400">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
