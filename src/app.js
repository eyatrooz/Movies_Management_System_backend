import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import movieRoute from "./Routes/movie.routes.js";

const app = express();
dotenv.config();

// for postman request : 
app.use(express.json());                             // Parse JSON  request bodies (for API requests)
app.use(express.urlencoded({ extended: true }));    // Parse form data  from HTML forms

const PORT = process.env.PORT;
app.listen(PORT, () => {

    console.log(`Server is running successfully at : http://localhost:${PORT}`);
});

// connection to mongoDB
const mongoURL = process.env.mongoURL;
const connectDB = async () => {
    try {

        await mongoose.connect(mongoURL);
        console.log('Server connected to mongoDB successfully !!');

    } catch (error) {
        console.log(`error occur while connecting to mongoDb, erorr :${error}`);
    }
};
connectDB();

// Movie Routes 
app.use("/movies", movieRoute);