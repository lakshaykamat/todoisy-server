import mongoose from "mongoose";
import Folder, { IFolder } from "../model/Folder.js";

/**
 * Function to create a new folder
 * @param {string} name - The name of the folder
 * @param {mongoose.Types.ObjectId} userId - The ID of the user who owns the folder
 * @returns {Promise<IFolder>} The created folder
 */
export async function createFolder(
  name: string,
  userId: mongoose.Types.ObjectId
): Promise<IFolder> {
  try {
    // Create the new folder
    const folder = new Folder({
      name,
      userId,
      todos: [], // Initialize an empty array for todos
    });

    // Save the folder
    await folder.save();

    console.log("Folder created:", folder);
    return folder;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
}
