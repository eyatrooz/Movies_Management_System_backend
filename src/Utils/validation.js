import { z } from "zod";

// User registration validation schema
export const registerSchema = z.object({
    email: z
        .string().toLowerCase()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password too long"),
    role: z
        .string().toLowerCase()
        .optional()
        .default("user")
});