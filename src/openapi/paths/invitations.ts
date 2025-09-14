export const invitationsPaths = {
  "/api/invitations": {
    get: {
      tags: ["Invitations"],
      summary: "Get user invitations",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Daftar undangan berhasil diambil",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Invitation" },
                  },
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
      tags: ["Invitations"],
      summary: "Create new invitation",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateInvitationRequest" },
          },
        },
      },
      responses: {
        "201": {
          description: "Undangan berhasil dibuat",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Invitation" },
            },
          },
        },
        "400": { $ref: "#/components/responses/BadRequest" },
        "401": { $ref: "#/components/responses/Unauthorized" },
        "500": { $ref: "#/components/responses/ServerError" },
      },
    },
  },
} as const;
