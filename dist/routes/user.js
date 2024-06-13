import express from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { HttpStatusCode } from "../lib/index.js";
import logger from "../lib/logger.js";
import Controller from "../controller/index.js";
const router = express.Router();
// Route to get all users
router.get("/", async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(HttpStatusCode.OK).json(users);
    }
    catch (error) {
        next(error);
    }
});
router.post("/register", Controller.User.validation.Register, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(HttpStatusCode.BAD_REQUEST)
            .json({ errors: errors.array() });
    }
    const { username, name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json({ error: "User already exists" });
        }
        user = await User.findOne({ username });
        if (user) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json({ error: "Username already in use" });
        }
        user = new User({
            username,
            name,
            email,
            password,
        });
        await user.save();
        logger.info(`New User Registered '${username}'`);
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(HttpStatusCode.CREATED).json({ token });
    }
    catch (err) {
        next(err);
    }
});
router.post("/login", Controller.User.validation.Login, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(HttpStatusCode.BAD_REQUEST)
            .json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json({ error: "Invalid credentials" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json({ error: "Invalid credentials" });
        }
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        logger.info(`Token issued to ${user.username}`);
        res.json({ token });
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=user.js.map