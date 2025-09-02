import { z } from "zod";

// User registration validation schema
export const registerSchema = z.object({
    email: z
        .string().toLowerCase()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password too long"),
    role: z
        .string().toLowerCase()
        .optional()
        .default("user")
});

// User log in validation schema
export const loginSchema = z.object({
    email: z
        .string().toLowerCase()
        .min(1, "email is required")
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(8, "Password is required, and must be at least 8 characters long")
        .max(100, "Password is too long")
})