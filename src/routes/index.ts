import express from "express";
import greetRouter from "./greet.js";
import todosRouter from "./todo.js";
import folderRouter from "./folder.js";
import userRouter from "./user.js";

const router = express.Router();

router.use("/", greetRouter);
router.use("/todos", todosRouter);
router.use("/folders", folderRouter);
router.use("/users", userRouter);

export default router;
