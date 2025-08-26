import mongoose from "mongoose";


const movieSchema = new mongoose.Schema({
    title: {

        type: String,
        required: true

    },
    year: {

        type: Number,
        required: true

    },
    category: {

        type: String,
        required: true

    },
    time: {

        type: String,
        required: true
    },
    director: {

        type: String,
        required: true
    },
    main_cast: {

        type: [String],

    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
});

export default mongoose.model('Movie', movieSchema);