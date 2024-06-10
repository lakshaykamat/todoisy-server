import User, { IUser } from "../model/User.js"; // Assuming User model is imported

/**
 * Function to create a new user
 * @param {string} username - The username of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<IUser>} The created user
 */
export async function createUser(
  username: string,
  email: string,
  name: string,
  password: string
): Promise<IUser> {
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
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
