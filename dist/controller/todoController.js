import mongoose from "mongoose";
import Todo from "../model/Todo.js";
import Folder from "../model/Folder.js";
async function createTodo(title, description, folderId) {
    try {
        // Ensure the folder exists
        const folder = await Folder.findById(folderId);
        if (!folder) {
            throw new Error("Folder not found");
        }
        // Create the new todo
        const todo = new Todo({
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
    }
    catch (error) {
        console.error("Error creating todo:", error.message || error);
        throw error;
    }
}
const allTodos = async () => {
    try {
        const todos = await Todo.find();
        return todos;
    }
    catch (error) {
        console.error("Error fetching todo:", error.message || error);
        throw error;
    }
};
const deleteTodo = async (todoId) => {
    try {
        // Ensure the provided ID is valid
        if (!mongoose.Types.ObjectId.isValid(todoId)) {
            throw new Error("Invalid todo ID");
        }
        // Find the todo by ID
        const todo = await Todo.findById(todoId);
        if (!todo) {
            throw new Error("Todo doesn't exist with this id");
        }
        // Find the associated folder
        const folder = await Folder.findById(todo.folderId);
        if (!folder) {
            throw new Error("Associated folder not found");
        }
        // Remove the todo from the folder's todos array
        folder.todos = folder.todos.filter((id) => id.toString() !== todoId.toString());
        await folder.save();
        // Delete the todo
        await Todo.findByIdAndDelete(todoId);
        console.log("Todo deleted successfully");
    }
    catch (error) {
        console.error("Error deleting todo:", error.message || error);
        throw error;
    }
};
const updateTodo = async (todoId, updateData) => {
    try {
        // Validate the provided ID
        if (!mongoose.Types.ObjectId.isValid(todoId)) {
            throw new Error("Invalid todo ID");
        }
        // Find the todo by ID
        const todo = await Todo.findById(todoId);
        if (!todo) {
            throw new Error("Todo not found");
        }
        // Update the todo with new data
        if (updateData.title)
            todo.title = updateData.title;
        if (updateData.description)
            todo.description = updateData.description;
        if (updateData.status)
            todo.status = updateData.status;
        // Save the updated todo
        const updatedTodo = await todo.save();
        console.log("Todo updated successfully:", updatedTodo);
        return updatedTodo;
    }
    catch (error) {
        console.error("Error updating todo:", error.message || error);
        throw Error;
    }
};
const TodoController = {
    create: createTodo,
    all: allTodos,
    delete: deleteTodo,
    update: updateTodo,
};
export default TodoController;
//# sourceMappingURL=todoController.js.map