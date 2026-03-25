import Credentials from "next-auth/providers/credentials";

export const credentialsFields = {
  email: {
    label: "Email",
    type: "email",
    placeholder: "johndoe@gmail.com",
  },
  password: {
    label: "Password",
    type: "password",
    placeholder: "********",
  },
} as const;

export function createPlaceholderCredentialsProvider() {
  return Credentials({
    credentials: credentialsFields,
    authorize: () => null,
  });
}

export function createCredentialsProvider(
  authorize: Parameters<typeof Credentials>[0]["authorize"],
) {
  return Credentials({
    credentials: credentialsFields,
    authorize,
  });
}
