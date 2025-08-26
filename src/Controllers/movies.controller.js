import Movie from "../Model/movie.model.js"

// function to add a movie 
export const addMovie = async (req, res, next) => {
    try {

        const { title, year, category, time, director, main_cast, rating } = req.body;

        const newMovie = { title, year, category, time, director, main_cast, rating };

        // Check required fields: title, category, director
        if (!title || !category || !director) {

            return res.status(400).json(
                {

                    success: false,
                    message: "Missing required fields: title, category, director"

                }
            )
        };

        // Validate year: must be a number in realistic range
        if (!year || isNaN(year) || year < 1900 || year > new Date().getFullYear()) {

            return res.status(400).json(
                {
                    success: false,
                    message: "year must be a valid number within realistic range"
                }
            );
        }

        // Check if time is provided
        if (!time || time.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Time cannot be empty"
            });
        }

        // Validate time length
        if (time.length < 2 || time.length > 15) {
            return res.status(400).json({
                success: false,
                message: "Time must be between 2 and 15 characters"
            });
        }

        // Validate main_cast: must be a non-empty array
        if (!main_cast || !Array.isArray(main_cast) || main_cast.length === 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "main_cast must be a non-empty array"
                }
            )
        };

        // Validate rating: must exist and be between 0 and 10
        if (rating === undefined || rating === null || rating < 0 || rating > 10) {

            return res.status(400).json(
                {
                    success: false,
                    message: "rating must be in range 0-10, and can't be empty "
                }
            )
        };

        const savedmovie = await Movie.create(newMovie);


        return res.status(201).json(

            {
                success: true,
                message: "Movie added successfully",
                movie: savedmovie
            }
        );
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "adding movie failed",
            error: error.message

        })
    };
};

// function to display all movies data
export const viewAllMovies = async (req, res, next) => {

    try {
        const movies = await Movie.find().sort({ year: -1 });

        // Check if no movies exist
        if (movies.length === 0) {
            return res.status(200).json(
                {
                    success: true,
                    message: "No movies found",
                    allMovies: []
                }
            );
        }
        return res.status(200).json({
            success: true,
            message: `Found ${movies.length} movies`,
            allMovies: movies
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: " Server error occured while fetching movies",
            error: error.message
        });
    }

};

export const getMovie = async (req, res, next) => {

    try {

        const { id } = req.params;

        // Check if movie ID was provided in request
        if (!id) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Movie ID is required"

                }
            );
        }

        const movie = await Movie.findById(id);

        // Check if movie with given ID exists
        if (!movie) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Movie not found"
                }
            )
        }

        return res.status(200).json(
            {
                success: true,
                message: "Movie Found",
                movie
            }
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error occured while fetching movies",
            error: error.message

        })
    };

};

// function to update a movie data
export const updateMovie = async (req, res, next) => {
    try {

        const { id } = req.params;
        if (!id) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Movie ID is required"
                }
            )
        }

        const updateMovie = await Movie.findById(id);

        if (!updateMovie) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Movie not found"
                }
            );
        };

        const { title, year, category, time, director, main_cast, rating } = req.body;



        if (title !== undefined) {
            if (!title) {
                return res.status(400).json(
                    {
                        success: false,
                        message: "title can not be empty"
                    }
                )
            }
            updateMovie.title = title;
        };

        if (year !== undefined) {
            if (!year || isNaN(year) || year < 1900 || year > new Date().getFullYear()) {

                return res.status(400).json(
                    {
                        success: false,
                        message: "year must be a valid number within realistic range"
                    }
                );
            }
            updateMovie.year = year;
        };

        if (time !== undefined) {
            if (!time || time.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: "Time cannot be empty"
                });
            }

            if (time.length < 2 || time.length > 15) {
                return res.status(400).json({
                    success: false,
                    message: "Time must be between 2 and 15 characters"
                });
            }

            updateMovie.time = time.trim();
        }

        if (category !== undefined) {
            if (!category) {
                return res.staus(400).json(
                    {
                        success: false,
                        message: "Category cannot be empty"
                    }
                )
            }

            updateMovie.category = category;

        };

        if (time !== undefined) {
            if (!time) {
                return res.status(400).json(
                    {
                        success: false,
                        message: "Production cannot be empty"
                    }
                )
            }

            updateMovie.production = time;

        };

        if (director !== undefined) {
            if (!director) {
                return res.status(400).json(
                    {
                        success: false,
                        message: "director cannot be empty"
                    }
                )
            }

            updateMovie.director = director;

        };

        if (main_cast !== undefined) {
            if (!main_cast || !Array.isArray(main_cast) || main_cast.length === 0) {
                return res.status(400).json(
                    {
                        success: false,
                        message: "main_cast must be a non-empty array"
                    }
                )
            };

            updateMovie.main_cast = main_cast;

        };

        if (rating !== undefined) {
            if (rating === undefined || rating === null || rating < 0 || rating > 10) {

                return res.status(400).json(
                    {
                        success: false,
                        message: "rating must be in range 0-10, and can't be empty "
                    }
                )
            };

            updateMovie.rating = rating;

        };

        await updateMovie.save();

        res.status(200).json(
            {
                message: "Movie updated successfully",
                movie: updateMovie
            }
        );

    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Server error occured while fetching movies",
                error: error.message
            }
        );
    }
};

// function to delete a movie 
export const deleteMovie = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if movie ID was provided
        if (!id) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Movie id is required"
                }
            )
        }

        const movieFound = await Movie.findById(id);

        // Check if movie exists in DB
        if (!movieFound) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Movie not Found"
                }
            );

        };

        const deletedMovie = await Movie.findByIdAndDelete(id);
        return res.status(200).json(
            {
                success: true,
                message: `The movie (${deletedMovie.title}) was deleted successfully`
            }
        );


    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Server error occured while deleting movies",
                error: error.message
            }
        );

    }
};

// function to search for a movie by it's title
export const searchByTitle = async (req, res, next) => {
    try {
        const { title } = req.query;

        // Check if title exists and is not empty
        if (!title || title.trim() === "") {
            return res.status(400).json(
                {
                    success: false,
                    message: "provied the movie title"
                }
            );
        }
        const targetMovie = await Movie.find(
            {
                title: {
                    $regex: title,          // $regex allows partial matching of the title      
                    $options: 'i'          // $options: 'i' makes the search case-insensitive
                }
            }).sort({ year: -1 });

        return res.status(200).json(
            {
                success: true,
                message: `Found ${targetMovie.length} movies matching ${title}`,
                targetMovie
            }

        );


    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Server error occured while Searching for the movie",
                error: error.message
            }
        );

    }

};

export const searchByCategory = async (req, res, next) => {
    try {
        const { category } = req.query;

        //  Check if category exists
        if (!category || category.trim() === "") {
            return res.status(400).json(
                {
                    success: false,
                    message: " Please provide a category"
                }
            );
        }

        //  Check if category is a string 
        if (!isNaN(category)) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Category must be text, not a number"
                }
            );
        }

        const categorizedMovies = await Movie.find({ category: { $regex: category, $options: 'i' } }).sort({ year: -1 });
        return res.status(200).json(
            {
                success: true,
                message: `found ${categorizedMovies.length} ${category} movies`,
                categorizedMovies
            }
        );


    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Server error searching by category",
                error: error.message
            }
        );


    }
};

export const searchByActor = async (req, res, next) => {
    try {

        const { actor } = req.query;

        // Check if actor is missing, empty, or not a valid string (numbers are not allowed)
        if (!actor || actor.trim() === "" || !isNaN(actor)) {
            res.status(400).json(
                {
                    success: false,
                    message: "Actor name must be valid"
                }
            );
        }
        const actorMovies = await Movie.find(
            {
                main_cast:
                {
                    $elemMatch:               // $elemMatch searches inside arrays
                    {
                        $regex: actor,
                        $options: 'i'
                    }
                }
            }
        );
        res.status(200).json(
            {
                success: true,
                message: `found ${actorMovies.length} movies for ${actor} `,
                actorMovies
            }
        )

    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Server error searching by Actor",
                error: error.message
            }
        );

    }

};

export const topRatedMovies = async (req, res, next) => {
    try {

        const topRatedMovies = await Movie.find(
            {
                rating: {
                    $gte: 7
                }          // $gte : greater than or equal to
            }
        ).sort({ year: -1, rating: -1 }).limit(10);

        return res.status(200).json(
            {
                success: true,
                message: `These are ${topRatedMovies.length} top rated movies`,
                topRatedMovies
            }
        )

    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Server error while fetching top rated movies",
                error: error.message
            }
        );

    }

};
