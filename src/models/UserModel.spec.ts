import { createPrismaClient } from "@/utils/prismaClient";
import { User } from "@prisma/client";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import UserModel from "./UserModel";

const user = {
  id: "376151bd-e083-49f4-8d2a-61388e263e44",
  name: "John Doe",
  email: "BfO7R@example.com",
  password: "password",
} as User;

const prisma = createPrismaClient();

describe("UserModel Tests", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a user", async () => {
    const createdUser = await UserModel.create(user);
    expect(createdUser).toHaveProperty("id");
    user.id = createdUser.id;
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.password).toBe("*********");
  });

  it("should update a user", async () => {
    const updatedUser = await UserModel.update(user.id, {
      ...user,
      name: "John Doe",
    });
    expect(updatedUser.name).toBe("John Doe");
  });

  it("should find a user by email", async () => {
    const foundUser = await UserModel.findByEmail(user.email);
    expect(foundUser).toHaveProperty("email", user.email);
  });

  it("should verify a user", async () => {
    const verifiedUser = await UserModel.verifyUser(
      user.email,
      user.password as string,
    );
    expect(verifiedUser).toHaveProperty("email", user.email);
  });

  it("should delete a user", async () => {
    const deletedUser = await UserModel.delete(user.id);
    expect(deletedUser).toHaveProperty("email", user.email);
  });
});
