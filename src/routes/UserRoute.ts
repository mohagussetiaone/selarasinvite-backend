import { Hono } from "hono";
import UserController from "@/controllers/UserController";
import AccessValidation from "@/validations/AccessValidation";

const UserRoute = new Hono();

// Public routes
UserRoute.post("/users", UserController.createUser);
UserRoute.post("/login", UserController.verifyUser);
UserRoute.get("/refresh-token", UserController.refreshToken);

// Protected routes
UserRoute.use("/users/*", AccessValidation.validateAccessToken);
UserRoute.put("/users/:id", UserController.updateUser);
UserRoute.get("/users", UserController.getUsers);
UserRoute.get("/users/:id", UserController.getUser);
UserRoute.delete("/users/:id", UserController.deleteUser);

export default UserRoute;
