import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import movieRoute from "./Routes/movie.routes.js";
import authRoute from "./Routes/auth.routes.js";





const app = express();
dotenv.config();

// Basic CORS for API testing
app.use(cors({
    credentials: true // Allow cookies
}));

// for postman request : 
app.use(express.json());                             // Parse JSON  request bodies (for API requests)
app.use(express.urlencoded({ extended: true }));    // Parse form data  from HTML forms
app.use(cookieParser());

const PORT = process.env.PORT;
app.listen(PORT, () => {

    console.log(`Server is running successfully at : http://localhost:${PORT}`);
});

// connection to mongoDB
const mongoURL = process.env.mongoURL;
const connectDB = async () => {
    try {

        const conn = await mongoose.connect(mongoURL);
        console.log(`MongoDB connected : ${conn.connection.host}`);
        console.log("Connected to mongoDB successfully");

    } catch (error) {
        console.log(`error occur while connecting to mongoDb, erorr :${error}`);
        process.exit(1); // Exit if database connection fails
    }
};
// Handle mongoDB connection events :
mongoose.connection.on('disconnected', () => {
    console.log('mongoDB disconnected');
});


mongoose.connection.on('error', (error) => {
    console.log(`mongoDB error : error : ${error.message}`);
});
connectDB();


//Routes 
app.use("/movies", movieRoute);
app.use("/auth", authRoute);

// Health check route
app.get("/health", (req, res) => {
    return res.status(200).json(
        {
            success: true,
            message: "server is runinning with authentication successfully",
            database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
        }
    );
});