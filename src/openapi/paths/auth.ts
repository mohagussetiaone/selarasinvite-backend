export const authPaths = {
  "/api/login": {
    post: {
      tags: ["Auth"],
      summary: "Login",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginRequest" },
          },
        },
      },
      responses: {
        "200": {
          description: "Login berhasil",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginResponse" },
            },
          },
        },
        "400": { $ref: "#/components/responses/BadRequest" },
        "500": { $ref: "#/components/responses/ServerError" },
      },
    },
  },
} as const;
