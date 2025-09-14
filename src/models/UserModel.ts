import { User } from "@prisma/client";
import { IUserModel } from "./interface/IUserModel";
import { createPrismaClient } from "@/utils/prismaClient";

const prisma = createPrismaClient();

class UserModel implements IUserModel {
  private haspassword = async (password: string): Promise<string> => {
    return Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });
  };

  private comparePassword = async (
    password: string,
    hashedPassword: string,
  ): Promise<boolean> => {
    return Bun.password.verify(password, hashedPassword);
  };

  async create(user: User): Promise<User> {
    await this.findByEmail(user.email).then((user) => {
      if (user) {
        throw new Error("Email already exists");
      }
    });
    user.password = await this.haspassword(user.password as string);
    return await prisma.user.create({ data: user }).then((user) => {
      user.password = "*********";
      return user;
    });
  }

  async update(id: string, user: User): Promise<User> {
    if (user.password && user.password.length > 0) {
      user.password = await this.haspassword(user.password as string);
    }
    return await prisma.user
      .update({
        where: { id },
        data: {
          name: user.name || undefined,
          email: user.email || undefined,
          password: user.password || undefined,
        },
      })
      .then((user) => {
        user.password = "*********";
        return user;
      });
  }

  async delete(id: string): Promise<User> {
    return await prisma.user.delete({ where: { id } }).then((user) => {
      user.password = "*********";
      return user;
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }
  async verifyUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (
      user &&
      (await this.comparePassword(password, user.password as string))
    ) {
      user.password = "*********";
      return user;
    }
    return null;
  }
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } }).then((user) => {
      if (user) {
        user.password = "*********";
      }
      return user;
    });
  }
  async findAll(): Promise<User[]> {
    return await prisma.user.findMany().then((users) => {
      users.forEach((user) => {
        user.password = "*********";
      });
      return users;
    });
  }
}

export default new UserModel();
