import Movie from "../Model/movie.model.js"

// function to add a movie 
export const addMovie = async (req, res, next) => {
    try {

        const { title, year, category, time, director, main_cast, rating } = req.body;

        const newMovie = { title, year, category, time, director, main_cast, rating };

        if (!title || !category || !director) {

            return res.status(400).json(
                {

                    success: false,
                    message: "Missing required fields: title, category, director"

                }
            )
        };

        if (!year || isNaN(year) || year < 1900 || year > new Date().getFullYear()) {

            return res.status(400).json(
                {
                    success: false,
                    message: "year must be a valid number within realistic range"
                }
            );
        }

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

        if (!main_cast || !Array.isArray(main_cast) || main_cast.length === 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "main_cast must be a non-empty array"
                }
            )
        };

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

        if (!id) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Movie ID is required"

                }
            );
        }

        const movie = await Movie.findById(id);

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
        if (!id) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Movie id is required"
                }
            )
        }

        const movieFound = await Movie.findById(id);
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
                    $regex: title,      // $regex : smart search ( partial search) : "search for any title contains '..' "
                    $options: 'i'       // $options: 'i' : ignorecase
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
