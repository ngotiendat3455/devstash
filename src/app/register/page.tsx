import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user?.email) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up your DevStash account to save snippets, notes, prompts, and collections in one place."
    >
      <RegisterForm />
    </AuthShell>
  );
}
