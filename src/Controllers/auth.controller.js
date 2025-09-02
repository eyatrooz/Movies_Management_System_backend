import bcrypt from "bcryptjs";  // needed this to hash User's password
import User from "../Model/user.model.js";
import { registerSchema } from "../Utils/validation.js";



export const register = async (req, res) => {
    try {

        // validate input data with zod
        const validationResault = registerSchema.safeParse(req.body);
        if (!validationResault.success) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Validation faield",
                    error: validationResault.error.errors.map(e => e.message),   //Use validationResault.error.flatten() or validationResault.error.errors to get the actual validation messages from Zod.
                }
            );
        };
        const { email, password, role } = validationResault.data;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json(            // 409: conflict
                {
                    success: false,
                    message: 'User with this email already exists'
                }
            );
        };

        // Hash password
        let saltRound = 12;                                                 //This number tells bcrypt how many times to mix up the password when creating the hash.
        const hashedPassword = await bcrypt.hash(password, saltRound);

        // Create new user
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role
        });

        // return user data without password
        const userResponds = {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt
        };
        return res.status(201).json(
            {
                success: true,
                message: "user registerd successfully",
                userData: newUser
            }
        );

    } catch (error) {
        console.error("Registration error:", error.message);

        // Handle MongoDB duplicate key error
        if (error.code === 11000) {             // 11000 :  MongoDB error code for duplicate key violation.
            return res.status(409).json({      // 409 : conflict
                success: false,
                message: "Email already exists"
            });
        };
        return res.status(500).json({
            success: false,
            message: "Internal server error during registration",
            error: error.message
        });

    }
};