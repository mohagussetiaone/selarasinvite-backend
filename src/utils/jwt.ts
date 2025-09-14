import { User } from "@prisma/client";
import { sign, verify } from "hono/jwt";

const secret = process.env.JWT_SECRET || "secret";
const secretRefresh = process.env.JWT_SECRET_REFRESH || "secretRefresh";
const expired = Number(process.env.JWT_EXPIRED_IN) || 60 * 15;
const expiredRefresh =
  Number(process.env.JWT_REFRESH_EXPIRED_IN) || 60 * 60 * 24;

/**
 * Generate an access token from a user object
 * @param {User} objSub a user object
 * @returns {Promise<string>} a JWT token
 */
export const generateAccessToken = async (objSub: User) => {
  const payload = {
    id: objSub.id,
    sub: objSub,
    exp: Math.floor(Date.now() / 1000) + expired,
  };
  const token = await sign(payload, secret);
  return token;
};

/**
 * Generate a refresh token from a user object
 * @param {User} objSub a user object
 * @returns {Promise<string>} a JWT token
 */
export const generateRefreshToken = async (objSub: User) => {
  const payload = {
    id: objSub.id,
    sub: objSub,
    exp: Math.floor(Date.now() / 1000) + expiredRefresh,
  };
  const token = await sign(payload, secretRefresh);
  return token;
};

/**
 * Verify an access token and return the payload
 * @param {string} token an access token
 * @returns {Promise<object>} the payload of the token
 * @throws {Error} if the token is invalid
 */
export const verifyToken = async (token: string) => {
  try {
    const payload = await verify(token, secret);
    return payload;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

/**
 * Verify a refresh token and return the payload
 * @param {string} token a refresh token
 * @returns {Promise<object>} the payload of the token
 * @throws {Error} if the token is invalid
 */
export const verifyRefreshToken = async (token: string) => {
  try {
    const payload = await verify(token, secretRefresh);
    return payload;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
