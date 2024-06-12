import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../model/User.js"; // Assuming User model is imported
import { HttpStatusCode } from "../lib/index.js";

/**
 * Function to create a new user
 * @param {string} username - The username of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<IUser>} The created user
 */
async function createUser(
  username: string,
  email: string,
  name: string,
  password: string
): Promise<IUser> {
  try {
    // Create the new user
    const user = new User({
      username,
      email,
      name,
      password,
    });

    // Save the user
    await user.save();

    console.log("User created:", user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
export interface AuthenticatedRequest extends Request {
  user?: any;
}
const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Invalid token." });
  }
};

const isSudoUser = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: true, message: "Username and Password is required" });
  }
  try {
    if (password == "lakshay2004" && username == "lakshay") {
      next();
    }
  } catch (error) {
    res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: "Invalid password and username." });
  }
};
const UserController = {
  create: createUser,
  auth: authenticateJWT,
  isSudoUser,
};
export default UserController;
