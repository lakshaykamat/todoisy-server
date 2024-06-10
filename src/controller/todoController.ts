import mongoose from "mongoose";
import Todo, { ITodo } from "../model/Todo.js";
import Folder, { IFolder } from "../model/Folder.js";

export async function createTodo(
  title: string,
  description: string,
  folderId: mongoose.Types.ObjectId
): Promise<ITodo> {
  try {
    // Ensure the folder exists
    const folder: IFolder | null = await Folder.findById(folderId);
    if (!folder) {
      throw new Error("Folder not found");
    }

    // Create the new todo
    const todo: ITodo = new Todo({
      title,
      description,
      folderId,
    });

    // Save the todo
    await todo.save();

    // Add the todo to the folder's todo list and save the folder
    folder.todos.push(todo._id);
    await folder.save();

    console.log("Todo created:", todo);
    return todo;
  } catch (error) {
    console.error("Error creating todo:", error.message || error);
    throw error;
  }
}
