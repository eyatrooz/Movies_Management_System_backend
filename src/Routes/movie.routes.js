import { Router } from "express";
import {

    addMovie,
    viewAllMovies,
    getMovie,
    updateMovie,
    deleteMovie,
    searchByTitle,
    searchByCategory,
    searchByActor,
    topRatedMovies,
    searchByYearRange,
    searchByYear

} from "../Controllers/movies.controller.js";


const router = Router();

router.post("/new", addMovie);

router.get("/allMovies", viewAllMovies);
router.get("/title", searchByTitle);
router.get("/category", searchByCategory);
router.get("/actor", searchByActor);
router.get("/searchByYearRange", searchByYearRange);
router.get("/searchByYear", searchByYear);
router.get("/topRated", topRatedMovies);
router.get("/:id", getMovie);
router.put("/:id", updateMovie);

router.delete("/:id", deleteMovie);





export default router;