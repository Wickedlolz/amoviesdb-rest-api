const Movie = require('../models/Movie');

exports.getAll = function () {
    return Movie.find({});
};

exports.getById = function (movieId) {
    return Movie.findById(movieId);
};

exports.create = async function (movieData) {
    const movie = new Movie({
        title: movieData.title,
        imageUrl: movieData.imageUrl,
        description: movieData.description,
    });

    await movie.save();

    return movie;
};

exports.updateById = async function (movieId, movieData) {
    const movie = await Movie.findById(movieId);

    movie.title = movieData.title;
    movie.imageUrl = movieData.imageUrl;
    movie.description = movieData.description;

    await movie.save();

    return movie;
};

exports.deleteById = async function (movieId) {
    const deletedMovie = await Movie.findByIdAndRemove(movieId);
    return deletedMovie;
};
