import express from "express";
import todosRouter from "./todo.js";
import greetRouter from "./greet.js";
import folderRouter from "./folder.js";
import userRouter from "./user.js";
import sudoRouter from "./sudo.js";
import Controller from "../controller/index.js";
const router = express.Router();
router.use("/", greetRouter);
router.use("/todos", Controller.User.auth, todosRouter);
router.use("/folders", Controller.User.auth, folderRouter);
router.use("/users", userRouter);
router.use("/sudo", Controller.User.isSudoUser, sudoRouter);
export default router;
//# sourceMappingURL=index.js.map