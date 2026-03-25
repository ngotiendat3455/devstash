import { z } from "zod";

const passwordSchema = z.string().min(8, "Password must be at least 8 characters long.");

export const changePasswordSchema = z
  .object({
    confirmNewPassword: z.string().min(1, "Please confirm your new password."),
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: passwordSchema,
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: "New password must be different from your current password.",
    path: ["newPassword"],
  })
  .refine((value) => value.newPassword === value.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });

export const deleteAccountSchema = z.object({
  confirmation: z.literal("DELETE", {
    error: "Type DELETE to confirm account deletion.",
  }),
});
