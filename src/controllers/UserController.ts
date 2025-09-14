import { User } from "@prisma/client";
import UserModel from "@/models/UserModel";
import { Context } from "hono";
// import Log from "@/utils/Logger";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt";
import {
  loginValidation,
  validateNoPasswordUser,
  validateUser,
} from "@/validations/UserValidation";

class UserController {
  async createUser(c: Context) {
    try {
      const data = await c.req.json();
      const parsedData = (await validateUser.parse(data)) as {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
      };

      const { name, email, password } = parsedData;
      const user = await UserModel.create({ name, email, password } as User);
      return c.json(
        {
          message: "User created successfully",
          data: user,
        },
        201,
      );
    } catch (error) {
      // Log.error("Error: ./controllers/UserController.createUser" + error);
      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal server error", data: null }, 500);
      }
    }
  }

  async verifyUser(c: Context) {
    try {
      const data = await c.req.json();
      const parsedData = (await loginValidation.parse(data)) as {
        email: string;
        password: string;
      };
      const { email, password } = parsedData;

      const userCheck = await UserModel.findByEmail(email);
      if (!userCheck) {
        return c.json({ message: "User not found", data: null }, 404);
      }
      const user = await UserModel.verifyUser(email, password);

      let token = null;
      let refreshToken = null;

      if (!user) {
        return c.json({ message: "Invalid credentials", data: null }, 401);
      }

      token = await generateAccessToken(user);
      refreshToken = await generateRefreshToken(user);

      return c.json(
        {
          message: "User logged in successfully",
          data: {
            ...user,
            token,
            refreshToken,
          },
        },
        200,
      );
    } catch (error) {
      // Log.error("Error: ./controllers/UserController.verifyUser" + error);
      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal server error", data: null }, 500);
      }
    }
  }

  async refreshToken(c: Context) {
    const authHeader = c.req.header("Authorization");
    const tokenRefresh = authHeader?.split(" ")[1];
    if (!tokenRefresh) {
      return c.json({ message: "Unauthorized", data: null }, 401);
    }
    try {
      const payload = await verifyRefreshToken(tokenRefresh);
      const user = await UserModel.findById(payload.id as string);
      if (!user) {
        return c.json({ message: "Unauthorized", data: null }, 404);
      }
      const token = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);
      return c.json(
        {
          message: "Token refreshed successfully",
          data: {
            ...user,
            token,
            refreshToken,
          },
        },
        200,
      );
    } catch {
      return c.json({ message: "Unauthorized", data: null }, 401);
    }
  }

  async updateUser(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const parsedData = (await validateNoPasswordUser.parse(data)) as {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
      };

      const { name, email, password } = parsedData;

      const checkUser = await UserModel.findById(id);
      if (!checkUser) {
        return c.json({ message: "User not found", data: null }, 404);
      }

      const checkEmail = await UserModel.findByEmail(email);
      if (checkEmail && checkEmail.id !== id) {
        return c.json({ message: "Email already exists", data: null }, 400);
      }

      const user = await UserModel.update(id, {
        name,
        email,
        password,
      } as User);

      return c.json(
        {
          message: "User updated successfully",
          data: user,
        },
        200,
      );
    } catch (error) {
      // Log.error("Error: ./controllers/UserController.updateUser" + error);
      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal server error", data: null }, 500);
      }
    }
  }

  async getUsers(c: Context) {
    try {
      const users = await UserModel.findAll();
      return c.json({ message: "Users found successfully", data: users }, 200);
    } catch (error) {
      // Log.error("Error: ./controllers/UserController.getUsers" + error);
      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal server error", data: null }, 500);
      }
    }
  }

  async getUser(c: Context) {
    try {
      const id = c.req.param("id");
      const user = await UserModel.findById(id);
      if (!user) {
        return c.json({ message: "User not found", data: null }, 404);
      }
      return c.json({ message: "User found successfully", data: user }, 200);
    } catch (error) {
      // Log.error("Error: ./controllers/UserController.getUser" + error);
      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal server error", data: null }, 500);
      }
    }
  }

  async deleteUser(c: Context) {
    try {
      const id = c.req.param("id");
      const userCheck = await UserModel.findById(id);
      if (!userCheck) {
        return c.json({ message: "User not found", data: null }, 404);
      }
      const userDeleted = await UserModel.delete(id);
      return c.json(
        { message: "User deleted successfully", data: userDeleted },
        200,
      );
    } catch (error) {
      // Log.error("Error: ./controllers/UserController.deleteUser" + error);
      if (error instanceof Error) {
        let message = error.message;
        try {
          message = JSON.parse(error.message)[0].message;
        } catch {
          message = error.message;
        }
        return c.json({ message, data: null }, 400);
      } else {
        return c.json({ message: "Internal server error", data: null }, 500);
      }
    }
  }
}

export default new UserController();
