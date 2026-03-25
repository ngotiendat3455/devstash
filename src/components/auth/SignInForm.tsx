"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { credentialsSignInSchema } from "@/lib/validation/auth";

interface SignInFormProps {
  callbackUrl: string;
  initialError?: string;
}

export function SignInForm({ callbackUrl, initialError }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [isCredentialsPending, setIsCredentialsPending] = useState(false);
  const [isGithubPending, setIsGithubPending] = useState(false);

  async function handleCredentialsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsed = credentialsSignInSchema.safeParse({ email, password });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email and password.");
      return;
    }

    setIsCredentialsPending(true);

    try {
      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        callbackUrl,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push(result.url ?? callbackUrl);
      router.refresh();
    } finally {
      setIsCredentialsPending(false);
    }
  }

  async function handleGithubSignIn() {
    setError("");
    setIsGithubPending(true);

    try {
      await signIn("github", { callbackUrl });
    } finally {
      setIsGithubPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
        <div className="space-y-2">
          <label htmlFor="sign-in-email" className="text-sm font-medium text-slate-200">
            Email
          </label>
          <Input
            id="sign-in-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sign-in-password" className="text-sm font-medium text-slate-200">
            Password
          </label>
          <Input
            id="sign-in-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isCredentialsPending || isGithubPending}>
          {isCredentialsPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Sign In
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
        <span className="h-px flex-1 bg-white/10" />
        <span>Or continue with</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGithubSignIn}
        disabled={isCredentialsPending || isGithubPending}
      >
        {isGithubPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
        Sign in with GitHub
      </Button>

      <p className="text-sm text-slate-400">
        New to DevStash?{" "}
        <Link href="/register" className="font-medium text-sky-300 transition hover:text-sky-200">
          Create an account
        </Link>
      </p>
    </div>
  );
}
