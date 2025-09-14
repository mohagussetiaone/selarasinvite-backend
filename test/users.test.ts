import UserModel from "@/models/UserModel";
import { createPrismaClient } from "@/utils/prismaClient";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
const BASE_URL = "http://localhost:3000/api";

let token = "";
let refreshToken = "";

const prisma = createPrismaClient();

const dummyUser = {
  name: "John Doe",
  email: "tq2b7@example.com",
  password: "Password@123",
  confirmPassword: "Password@123",
};

beforeAll(async () => {
  await prisma.$connect();
  await prisma.user.deleteMany();
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("REST API USERS", () => {
  it("should create a new user with POST /api/users", async () => {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dummyUser),
    });
    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data).toHaveProperty("message", "User created successfully");
    expect(data).toHaveProperty("data");
    expect(data.data).toHaveProperty("id");
    expect(data.data).toHaveProperty("name", dummyUser.name);
    expect(data.data).toHaveProperty("email", dummyUser.email);
  });

  it("shoult login a user with post /api/login", async () => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: dummyUser.email,
        password: dummyUser.password,
      }),
    });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("message", "User logged in successfully");
    expect(data).toHaveProperty("data");
    expect(data.data).toHaveProperty("token");
    expect(data.data).toHaveProperty("refreshToken");
    token = data.data.token;
    refreshToken = data.data.refreshToken;
  });

  it("should refresh token with POST /api/refresh-token", async () => {
    const response = await fetch(`${BASE_URL}/refresh-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("message", "Token refreshed successfully");
    expect(data).toHaveProperty("data");
    expect(data.data).toHaveProperty("token");
    expect(data.data).toHaveProperty("refreshToken");
    token = data.data.token;
    refreshToken = data.data.refreshToken;
  });

  it("should refresh unauthorized token with POST /api/refresh-token", async () => {
    const response = await fetch(`${BASE_URL}/refresh-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data).toHaveProperty("message", "Unauthorized");
    expect(data).toHaveProperty("data", null);
  });

  it("should update a user with PUT /api/users/:id", async () => {
    const users = await UserModel.findAll();
    const id = users[0].id;
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dummyUser),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toEqual("User updated successfully");
    expect(data.data).toHaveProperty("id");
  });

  it("should unauthorize if update user without token", async () => {
    const users = await UserModel.findAll();
    const id = users[0].id;
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dummyUser),
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data).toHaveProperty("message", "Unauthorized");
    expect(data).toHaveProperty("data", null);
  });

  it("should get all users with GET /api/users", async () => {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  it("should unauthorize if get all users without token", async () => {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data).toHaveProperty("message", "Unauthorized");
    expect(data).toHaveProperty("data", null);
  });

  it("should get a user by id with GET /api/users/:id", async () => {
    const users = await UserModel.findAll();
    const id = users[0].id;
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data).toHaveProperty("id");
  });

  it("should unathorize if get user without token", async () => {
    const users = await UserModel.findAll();
    const id = users[0].id;
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "GET",
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.message).toEqual("Unauthorized");
  });

  it("should delete a user by id with DELETE /api/users/:id", async () => {
    const users = await UserModel.findAll();
    const id = users[0].id;
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.message).toEqual("User deleted successfully");
    expect(body.data).toHaveProperty("id");
  });

  it("should unathorize if delete user without token", async () => {
    const users = await UserModel.findAll();
    let id = "cmfhwz1dq0006ujjon0aza5ll";
    if (users.length > 0) {
      id = users[0].id;
    }
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.message).toEqual("Unauthorized");
  });
});
