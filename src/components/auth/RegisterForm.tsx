"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/validation/auth";

interface RegisterFormState {
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
}

const initialState: RegisterFormState = {
  confirmPassword: "",
  email: "",
  name: "",
  password: "",
};

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormState>(initialState);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsed = registerSchema.safeParse(form);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter valid registration details.");
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const payload = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok || !payload.success) {
        setError(payload.error ?? "Unable to create your account.");
        return;
      }

      const searchParams = new URLSearchParams({
        registered: "1",
        email: parsed.data.email,
      });

      router.push(`/sign-in?${searchParams.toString()}`);
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="register-name" className="text-sm font-medium text-slate-200">
            Name
          </label>
          <Input
            id="register-name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Brad Traversy"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="register-email" className="text-sm font-medium text-slate-200">
            Email
          </label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="register-password" className="text-sm font-medium text-slate-200">
            Password
          </label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="At least 8 characters"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="register-confirm-password" className="text-sm font-medium text-slate-200">
            Confirm password
          </label>
          <Input
            id="register-confirm-password"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm((current) => ({ ...current, confirmPassword: event.target.value }))
            }
            placeholder="Repeat your password"
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Create Account
        </Button>
      </form>

      <p className="text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-sky-300 transition hover:text-sky-200">
          Sign in
        </Link>
      </p>
    </div>
  );
}
