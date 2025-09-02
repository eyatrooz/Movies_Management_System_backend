import mongoose, { model } from "mongoose";


const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address"
            ]
        },

        password: {
            type: String,
            required: [true, " password is required"],
            minLength: [8, " password must be at least 8 characters long"],
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },

    {
        timestamps: true,    // Adds createdAt and updatedAt automaticall
    }
);

export default mongoose.model("User", userSchema);      