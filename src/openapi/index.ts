import { tags } from "./tags";
import { securitySchemes } from "./components/securitySchemes";
import { schemas } from "./components/schemas";
import { responses } from "./components/response";
import { usersPaths } from "./paths/users";
import { catalogsPaths } from "./paths/catalogs";
import { invitationsPaths } from "./paths/invitations";
import { authPaths } from "./paths/auth";

export const openAPIDocument = {
  openapi: "3.1.0",
  info: {
    title: "Wedding Invitation API",
    description: "API untuk manajemen undangan pernikahan digital",
    version: "1.0.0",
    contact: {
      name: "API Support",
      email: "support@weddingapp.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://production.com",
      description: "Production server",
    },
  ],
  tags,
  paths: {
    ...usersPaths,
    ...catalogsPaths,
    ...invitationsPaths,
    ...authPaths,
  },
  components: {
    securitySchemes,
    schemas,
    responses,
  },
};
