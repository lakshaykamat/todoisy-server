import jwt from "jsonwebtoken";
import { body } from "express-validator";
import User from "../model/User.js"; // Assuming User model is imported
import { HttpStatusCode } from "../lib/index.js";
const validation = {
    Register: [
        body("username")
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 characters long"),
        body("email").isEmail().withMessage("Email is not valid"),
        body("name").isLength({ min: 3 }).withMessage("Name is not valid"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    Login: [
        body("email").isEmail().withMessage("Email is not valid"),
        body("password").exists().withMessage("Password is required"),
    ],
};
/**
 * Function to create a new user
 * @param {string} username - The username of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<IUser>} The created user
 */
async function createUser(username, email, name, password) {
    try {
        // Create the new user
        const user = new User({
            username,
            email,
            name,
            password,
        });
        // Save the user
        await user.save();
        console.log("User created:", user);
        return user;
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res
            .status(HttpStatusCode.UNAUTHORIZED)
            .json({ error: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Invalid token." });
    }
};
const isSudoUser = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw Error("Username and password required");
    }
    if (password == process.env.ADMIN_PASSWORD &&
        username == process.env.ADMIN_USERNAME) {
        next();
    }
    else {
        throw Error("Invalid password and username.");
    }
};
const UserController = {
    create: createUser,
    auth: authenticateJWT,
    validation,
    isSudoUser,
};
export default UserController;
//# sourceMappingURL=userController.js.map