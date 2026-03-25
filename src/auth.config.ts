import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

import { createPlaceholderCredentialsProvider } from "@/lib/auth/credentials";

const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  providers: [GitHub, createPlaceholderCredentialsProvider()],
} satisfies NextAuthConfig;

export default authConfig;
