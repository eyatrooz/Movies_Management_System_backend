import { Router } from "express";
import {

    addMovie,
    viewAllMovies,
    getMovie, updateMovie,
    deleteMovie,
    searchByTitle

} from "../Controllers/movies.controller.js";


const router = Router();

router.post("/new", addMovie);
router.get("/allMovies", viewAllMovies);
router.get("/search", searchByTitle);
router.get("/:id", getMovie);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);




export default router;