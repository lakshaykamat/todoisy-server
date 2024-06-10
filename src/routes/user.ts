import express, { Request, Response } from "express";
import User from "../model/User.js";
import { createUser } from "../controller/userController.js";

const router = express.Router();

// Route to get all users
router.get("/all", async (req: Request, res: Response) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to create a new user
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { username, email, password, name } = req.body;

    // Validate request body
    if (!username || !email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    // Call createUser function to create a new user
    const user = await createUser(username, email, name, password);

    // Return the created user in the response
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
