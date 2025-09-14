import { describe, it, expect } from "bun:test";
import {
  loginValidation,
  resetPasswordValidation,
  validateNoPasswordUser,
  validateUser,
} from "./UserValidation";

describe("UserValidation Tests", () => {
  it("should validate a user with correct data", async () => {
    const validUser = {
      name: "John Doe",
      email: "BfO7R@example.com",
      password: "StrongPassword@123",
      confirmPassword: "StrongPassword@123",
    };
    const validationResult = validateUser.safeParse(validUser);
    expect(validationResult.success).toBe(true);
  });

  it("should fail validation for user with incorrect email", async () => {
    const invalidUser = {
      name: "John Doe",
      email: "invalid-email",
      password: "StrongPassword@123",
      confirmPassword: "StrongPassword@123",
    };
    const validationResult = validateUser.safeParse(invalidUser);
    expect(validationResult.success).toBe(false);
  });

  it("should validation user without password and role USER", async () => {
    const invalidUser = {
      name: "John Doe",
      email: "BfO7R@example.com",
      role: "USER",
    };
    const validationResult = validateNoPasswordUser.safeParse(invalidUser);
    expect(validationResult.success).toBe(true);
  });

  it("should validation login with correct credentials", async () => {
    const invalidUser = {
      email: "BfO7R@example.com",
      password: "password123",
    };
    const validationResult = loginValidation.safeParse(invalidUser);
    expect(validationResult.success).toBe(true);
  });

  it("should validate reset password with matching passwords", () => {
    const resetPasswordData = {
      password: "NewPassword@123",
      confirmPassword: "NewPassword@123",
    };

    const validationResult =
      resetPasswordValidation.safeParse(resetPasswordData);
    expect(validationResult.success).toBe(true);
  });

  it("should fail reset password validation for non-matching passwords", () => {
    const resetPasswordData = {
      password: "NewPassword@123",
      confirmPassword: "DifferentPassword@123",
    };

    const validationResult =
      resetPasswordValidation.safeParse(resetPasswordData);
    expect(validationResult.success).toBe(false);
  });
});
