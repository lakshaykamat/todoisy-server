import mongoose, { Document } from "mongoose";

export interface IFolder extends Document {
  name: string;
  userId: mongoose.Schema.Types.ObjectId;
  todos: mongoose.Schema.Types.ObjectId[];
  todoCount: number;
  addTodo: (todoId: mongoose.Types.ObjectId) => void;
}

const FolderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    todos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo",
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index to improve query performance on userId
FolderSchema.index({ userId: 1 });

// Static method to find folders by userId
FolderSchema.statics.findByUserId = function (userId: mongoose.Types.ObjectId) {
  return this.findById(userId);
};

// Instance method to add a todo to the folder
FolderSchema.methods.addTodo = async function (
  todoId: mongoose.Types.ObjectId
) {
  this.todos.push(todoId);
  await this.save();
};

// Virtual property for todo count
FolderSchema.virtual("todoCount").get(function () {
  return this.todos.length;
});

export default mongoose.model<IFolder>("Folder", FolderSchema);
