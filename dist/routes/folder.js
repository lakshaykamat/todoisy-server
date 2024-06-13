import express from "express";
import Controller from "../controller/index.js";
import mongoose from "mongoose";
import { HttpStatusCode } from "../lib/index.js";
const router = express.Router();
router.get("/", async (req, res, next) => {
    try {
        // Fetch all todos
        const foldres = await Controller.Folder.all();
        res.status(HttpStatusCode.OK).json(foldres);
    }
    catch (error) {
        next(error);
    }
});
router.post("/create", async (req, res, next) => {
    try {
        const { title, userId } = req.body;
        // Validate request body
        if (!title || !userId) {
            return res
                .status(400)
                .json({ message: "Title and User ID are required" });
        }
        const todo = await Controller.Folder.create(title, userId);
        res.status(201).json({ message: "Folder created successfully", todo });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/del/:folderID", async (req, res, next) => {
    try {
        const { folderID } = req.params;
        // Validate the provided folder ID
        if (!mongoose.Types.ObjectId.isValid(folderID)) {
            return res
                .status(400)
                .json({ error: true, message: "Invalid Folder iD" });
        }
        // Attempt to delete the todo
        await Controller.Folder.delete(new mongoose.Types.ObjectId(folderID));
        res
            .status(200)
            .json({ success: true, message: "Folder deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=folder.js.map