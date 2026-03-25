import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";

function getSignInErrorMessage(error: string | undefined) {
  if (!error) {
    return undefined;
  }

  if (error === "CredentialsSignin") {
    return "Invalid email or password.";
  }

  return "Unable to sign in right now. Please try again.";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();

  if (session?.user?.email) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await searchParams;
  const callbackUrl =
    typeof resolvedSearchParams.callbackUrl === "string"
      ? resolvedSearchParams.callbackUrl
      : "/dashboard";
  const error =
    typeof resolvedSearchParams.error === "string"
      ? getSignInErrorMessage(resolvedSearchParams.error)
      : undefined;
  const registered = resolvedSearchParams.registered === "1";

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your collections, prompts, snippets, and saved developer workflows."
    >
      <div className="space-y-6">
        {registered ? (
          <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Your account is ready. Sign in to continue.
          </p>
        ) : null}

        <SignInForm callbackUrl={callbackUrl} initialError={error} />
      </div>
    </AuthShell>
  );
}
