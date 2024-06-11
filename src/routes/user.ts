import express, { NextFunction, Request, Response } from "express";
import User from "../model/User.js";
import Controller from "../controller/index.js";
import { HttpStatusCode } from "../lib/index.js";

const router = express.Router();

// Route to get all users
router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    res.status(HttpStatusCode.OK).json(users);
  } catch (error) {
    next(error);
  }
});

// Route to create a new user
router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, name } = req.body;

      // Validate request body
      if (!username || !email || !password || !name) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Username, email, and password are required" });
      }

      // Call createUser function to create a new user
      const user = await Controller.User.create(
        username,
        email,
        name,
        password
      );

      // Return the created user in the response
      res
        .status(HttpStatusCode.CREATED)
        .json({ message: "User created successfully", user });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
