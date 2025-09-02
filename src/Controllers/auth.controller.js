import bcrypt from "bcryptjs";  // needed this to hash User's password
import jwt from "jsonwebtoken";
import User from "../Model/user.model.js";
import { loginSchema, registerSchema } from "../Utils/validation.js";




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

export const logIn = async (req, res) => {
    try {

        // validate input data with zod schema
        const validationResault = loginSchema.safeParse(req.body);

        if (!validationResault) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Validation failed",
                    errors: validationResault.error.errors.map(e => e.message)
                }
            );
        };

        const { email, password } = validationResault.data;

        // find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid email or password"
                }
            );
        };
        // compare password with hashed password 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invlaid email or password"
                }
            );
        };

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN },

        );

        // Send success response with token
        return res.status(200).json(
            {
                success: true,
                message: "Login successfull",
                token: token,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                }
            }
        );

    } catch (error) {
        console.log(`Login error : ${error.message}`);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error ocurr during login",
                error: error.message
            }
        );

    }

};
