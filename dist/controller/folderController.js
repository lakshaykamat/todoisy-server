import mongoose from "mongoose";
import Folder from "../model/Folder.js";
import Todo from "../model/Todo.js";
/**
 * Function to create a new folder
 * @param {string} name - The name of the folder
 * @param {mongoose.Types.ObjectId} userId - The ID of the user who owns the folder
 * @returns {Promise<IFolder>} The created folder
 */
async function createFolder(name, userId) {
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
    }
    catch (error) {
        console.error("Error creating folder:", error);
        throw error;
    }
}
/**
 * Deletes a folder from the database
 * @param {mongoose.Types.ObjectId} folderID - The ID of the user who owns the folder
 * @returns {Promise<void>}
 */
const deleteFolder = async (folderID) => {
    try {
        // Validate the provided folder ID
        if (!mongoose.Types.ObjectId.isValid(folderID)) {
            throw new Error("Invalid folder ID");
        }
        // Find the folder by ID
        const folder = await Folder.findById(folderID);
        if (!folder) {
            throw new Error("Folder not found");
        }
        // Delete all associated todos
        await Todo.deleteMany({ folderId: folderID });
        // Delete the folder itself
        await Folder.findByIdAndDelete(folderID);
        console.log("Folder and associated todos deleted successfully");
    }
    catch (error) {
        console.error("Error deleting folder:", error.message || error);
        throw error;
    }
};
const allFolders = async () => {
    try {
        const folders = await Folder.find();
        return folders;
    }
    catch (error) {
        throw Error;
    }
};
const FolderController = {
    create: createFolder,
    all: allFolders,
    delete: deleteFolder,
};
export default FolderController;
//# sourceMappingURL=folderController.js.map