export const parameters = {
  pagination: {
    page: {
      name: "page",
      in: "query",
      description: "Page number",
      schema: { type: "integer", minimum: 1, default: 1 },
    },
    limit: {
      name: "limit",
      in: "query",
      description: "Items per page",
      schema: {
        type: "integer",
        minimum: 1,
        maximum: 100,
        default: 10,
      },
    },
  },
  idPath: {
    name: "id",
    in: "path",
    required: true,
    description: "Resource ID",
    schema: { type: "string" },
  },
} as const;
