import express, { Request, Response } from "express";
import Todo from "../model/Todo.js";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const todos = await Todo.find();
  return res.json(todos);
});

export default router;
