import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import { ZodError } from "zod";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";
import { createCredentialsProvider } from "@/lib/auth/credentials";
import { prisma } from "@/lib/prisma";
import { credentialsSignInSchema } from "@/lib/validation/auth";

const authProviders = [
  authConfig.providers[0],
  createCredentialsProvider(async (credentials) => {
    try {
      const { email, password } = await credentialsSignInSchema.parseAsync(credentials);
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          password: true,
        },
      });

      if (!user?.password) {
        return null;
      }

      const isValidPassword = await compare(password, user.password);

      if (!isValidPassword) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return null;
      }

      throw error;
    }
  }),
];

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: authProviders,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  pages: authConfig.pages,
});
