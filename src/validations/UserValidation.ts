import { z, ZodType } from "zod";

export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character");

export const validateUser: ZodType = z
  .object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    email: z.string().email({ message: "Invalid email format" }),
    password: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords and  confirmPassword do not match",
    path: ["confirmPassword"],
  });

export const validateNoPasswordUser: ZodType = z
  .object({
    name: z.string().min(1, "Name must be at least 1 characters long"),
    email: z
      .string()
      .min(1, "Email must be at least 1 characters long")
      .email("Invalid email format"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password && data.confirmPassword) {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Passwords do not match",
          //   expected: "Matching passwords",
          //   received: data.confirmPassword,
        });
      }
    }
  });

export const loginValidation: ZodType = z.object({
  email: z
    .string()
    .min(1, "Email must be at least 1 characters long")
    .email("Invalid email format"),
  password: z.string().min(1, "Password must be at least 1 characters long"),
});

export const resetPasswordValidation: ZodType = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords and  confirmPassword do not match",
    path: ["confirmPassword"],
  });
