import { parameters } from "../components/parameters";

export const usersPaths = {
  "/api/users": {
    get: {
      tags: ["Users"],
      summary: "Get all users",
      security: [{ bearerAuth: [] }],
      parameters: [parameters.pagination.page, parameters.pagination.limit],
      responses: {
        "200": {
          description: "Daftar user berhasil diambil",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" },
                  },
                  pagination: { $ref: "#/components/schemas/Pagination" },
                },
              },
            },
          },
        },
        "401": { $ref: "#/components/responses/Unauthorized" },
        "500": { $ref: "#/components/responses/ServerError" },
      },
    },
    post: {
      tags: ["Users"],
      summary: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateUserRequest" },
          },
        },
      },
      responses: {
        "201": {
          description: "User berhasil dibuat",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
            },
          },
        },
        "400": { $ref: "#/components/responses/BadRequest" },
        "500": { $ref: "#/components/responses/ServerError" },
      },
    },
  },
  "/api/users/{id}": {
    get: {
      tags: ["Users"],
      summary: "Get user by ID",
      security: [{ bearerAuth: [] }],
      parameters: [parameters.idPath],
      responses: {
        "200": {
          description: "Data user berhasil diambil",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
            },
          },
        },
        "404": { $ref: "#/components/responses/NotFound" },
        "500": { $ref: "#/components/responses/ServerError" },
      },
    },
    put: {
      tags: ["Users"],
      summary: "Update user",
      security: [{ bearerAuth: [] }],
      parameters: [parameters.idPath],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateUserRequest" },
          },
        },
      },
      responses: {
        "200": {
          description: "User berhasil diupdate",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
            },
          },
        },
        "400": { $ref: "#/components/responses/BadRequest" },
        "404": { $ref: "#/components/responses/NotFound" },
        "500": { $ref: "#/components/responses/ServerError" },
      },
    },
    delete: {
      tags: ["Users"],
      summary: "Delete user",
      security: [{ bearerAuth: [] }],
      parameters: [parameters.idPath],
      responses: {
        "204": { description: "User berhasil dihapus" },
        "404": { $ref: "#/components/responses/NotFound" },
        "500": { $ref: "#/components/responses/ServerError" },
      },
    },
  },
} as const;
