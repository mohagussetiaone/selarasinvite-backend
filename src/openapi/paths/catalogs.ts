export const catalogsPaths = {
  "/api/catalogs": {
    get: {
      tags: ["Catalogs"],
      summary: "Get all catalogs",
      parameters: [
        {
          name: "category",
          in: "query",
          description: "Filter by category",
          schema: { type: "string" },
        },
        {
          name: "isPublish",
          in: "query",
          description: "Filter by publish status",
          schema: { type: "boolean" },
        },
      ],
      responses: {
        "200": {
          description: "Daftar katalog berhasil diambil",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Catalog" },
                  },
                },
              },
            },
          },
        },
        "500": { $ref: "#/components/responses/ServerError" },
      },
    },
    post: {
      tags: ["Catalogs"],
      summary: "Create new catalog",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateCatalogRequest" },
          },
        },
      },
      responses: {
        "201": {
          description: "Katalog berhasil dibuat",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Catalog" },
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
