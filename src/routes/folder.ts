import express, { Request, Response } from "express";
import { createFolder } from "../controller/folderController.js";
import Folder, { IFolder } from "../model/Folder.js";

const router = express.Router();

router.get("/all", async (req: Request, res: Response) => {
  try {
    // Fetch all todos
    const todos: IFolder[] = await Folder.find();

    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/create", async (req: Request, res: Response) => {
  try {
    const { title, userId } = req.body;

    // Validate request body
    if (!title || !userId) {
      return res
        .status(400)
        .json({ message: "Title and User ID are required" });
    }

    const todo = await createFolder(title, userId);

    res.status(201).json({ message: "Folder created successfully", todo });
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
