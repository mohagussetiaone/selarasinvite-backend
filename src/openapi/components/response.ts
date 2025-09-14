export const responses = {
  Unauthorized: {
    description: "Token tidak valid atau tidak ada",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: { type: "string", example: "Unauthorized" },
          },
        },
      },
    },
  },
  NotFound: {
    description: "Resource tidak ditemukan",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: { type: "string", example: "Not found" },
          },
        },
      },
    },
  },
  BadRequest: {
    description: "Request tidak valid",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: { type: "string", example: "Bad request" },
            details: { type: "object" },
          },
        },
      },
    },
  },
  ServerError: {
    description: "Terjadi kesalahan server",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: { type: "string", example: "Internal server error" },
          },
        },
      },
    },
  },
} as const;
