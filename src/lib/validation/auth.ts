import { z } from "zod";

const emailSchema = z.email().trim().toLowerCase();
const passwordSchema = z.string().min(8, "Password must be at least 8 characters long.");

export const credentialsSignInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required.").max(100, "Name is too long."),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type CredentialsSignInInput = z.infer<typeof credentialsSignInSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
