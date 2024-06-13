import express from "express";
import mongoose from "mongoose";
import Todo from "../model/Todo.js";
import Controller from "../controller/index.js";
import { HttpStatusCode } from "../lib/index.js";
import Folder from "../model/Folder.js";
const router = express.Router();
/**
 * @route GET /all
 * @description Fetch all todos
 * @access Public
 */
router.get("/", async (req, res, next) => {
    try {
        console.log(req.user);
        //@ts-ignore
        const folder = await Folder.findByUserId(req.user.userId);
        console.log(folder[0].todos);
        const todos = await Todo.findById(folder[0].todos);
        res.status(HttpStatusCode.OK).json(todos);
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route POST /create
 * @description Create a new todo
 * @access Public
 */
router.post("/create", async (req, res, next) => {
    try {
        const { title, description, folderId } = req.body;
        // Validate request body
        if (!title || !description || !folderId) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json({ message: "Title, description, and folderId are required" });
        }
        // Call createTodo function to create a new todo
        const todo = await Controller.Todo.create(title, description, folderId);
        res
            .status(HttpStatusCode.CREATED)
            .json({ message: "Todo created successfully", todo });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route DELETE /del/:todoID
 * @description Delete a todo
 * @access Public
 */
router.delete("/del/:todoID", async (req, res, next) => {
    const { todoID } = req.params;
    // Validate the provided ID
    if (!mongoose.Types.ObjectId.isValid(todoID)) {
        return res
            .status(HttpStatusCode.BAD_REQUEST)
            .json({ error: true, message: "Invalid todo ID" });
    }
    try {
        // Attempt to delete the todo
        await Controller.Todo.delete(new mongoose.Types.ObjectId(todoID));
        res
            .status(HttpStatusCode.OK)
            .json({ success: true, message: "Todo deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
router.put("/update/:todoID", async (req, res, next) => {
    const { todoID } = req.params;
    const updateData = req.body;
    if (!mongoose.Types.ObjectId.isValid(todoID)) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
            error: true,
            message: "Invalid todo ID",
        });
    }
    try {
        const updatedTodo = await Controller.Todo.update(new mongoose.Types.ObjectId(todoID), updateData);
        res.status(HttpStatusCode.OK).json({
            success: true,
            message: "Todo updated successfully",
            data: updatedTodo,
        });
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=todo.js.map