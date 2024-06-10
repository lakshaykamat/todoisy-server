import express, { Request, Response } from "express";
import Todo, { ITodo } from "../model/Todo.js";
import { createTodo } from "../controller/todoController.js";

const router = express.Router();

router.get("/all", async (req: Request, res: Response) => {
  try {
    // Fetch all todos
    const todos: ITodo[] = await Todo.find();

    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/create", async (req: Request, res: Response) => {
  try {
    const { title, description, folderId } = req.body;

    // Validate request body
    if (!title || !description || !folderId) {
      return res
        .status(400)
        .json({ message: "Title, description, and folderId are required" });
    }

    // Call createTodo function to create a new todo
    const todo = await createTodo(title, description, folderId);

    // Return the created todo in the response
    res.status(201).json({ message: "Todo created successfully", todo });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
