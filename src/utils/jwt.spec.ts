import { User } from "@prisma/client";
import { describe, expect, it } from "bun:test";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyToken,
} from "./jwt";

const mockUser = {
  id: "376151bd-e083-49f4-8d2a-61388e263e44",
  name: "John Doe",
  email: "BfO7R@example.com",
  password: "password",
  address: "123 Main St",
  image: "https://example.com/avatar.jpg",
  role: "USER",
  phone: "1234567890",
} as User;

describe("JWT Utility Tests", () => {
  it("should generate a valid access token", async () => {
    const token = await generateAccessToken(mockUser);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("should generate a valid token", async () => {
    const token = await generateAccessToken(mockUser);
    const payload = await verifyToken(token);
    expect(payload).toHaveProperty("id", mockUser.id);
    expect(payload).toHaveProperty("sub", mockUser);
  });

  it("should throw an error if the token is invalid", async () => {
    try {
      await verifyToken("invalid.token");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it("should generate a valid refresh token", async () => {
    const token = await generateRefreshToken(mockUser);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("Should verify a valid refresh token", async () => {
    const token = await generateRefreshToken(mockUser);
    const payload = await verifyRefreshToken(token);
    expect(payload).toHaveProperty("id", mockUser.id);
    expect(payload).toHaveProperty("sub", mockUser);
  });

  it("Should throw an error if the refresh token is invalid", async () => {
    try {
      await verifyRefreshToken("invalid.token");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
