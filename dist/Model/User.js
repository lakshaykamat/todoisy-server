import bcrypt from "bcrypt";
import mongoose from "mongoose";
// Define the schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, "is invalid"],
        index: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    folders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
        },
    ],
    userXp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Pre-save middleware to hash the password and lowercase the username before saving the user
UserSchema.pre("save", async function (next) {
    if (this.isModified("username") || this.isNew) {
        this.username = this.username.toLowerCase();
    }
    if (this.isModified("password") || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        }
        catch (err) {
            next(err);
        }
    }
    else {
        return next();
    }
});
// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
// Static method to find a user by email
UserSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};
// Export the model
export default mongoose.model("User", UserSchema);
//# sourceMappingURL=User.js.map