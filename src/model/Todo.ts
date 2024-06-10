import mongoose, { Document, Schema } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description: string;
  status: "pending" | "completed";
  folderId: mongoose.Schema.Types.ObjectId;
}

// Define the schema
const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Static method to find todos by folderId
TodoSchema.statics.findByFolderId = function (folderId) {
  return this.find({ folderId });
};

// Method to mark a todo as completed
TodoSchema.methods.markAsCompleted = function () {
  this.status = "completed";
  return this.save();
};

// Virtual property for brief description (first 50 characters of the description)
TodoSchema.virtual("briefDescription").get(function () {
  return this.description.length > 50
    ? `${this.description.substring(0, 50)}...`
    : this.description;
});

// Ensure indexing on folderId for efficient querying
TodoSchema.index({ folderId: 1 });

// Export the model
export default mongoose.model<ITodo>("Todo", TodoSchema);
