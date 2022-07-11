const Movie = require('../models/Movie');

exports.getAll = function (query, skipIndex, limit) {
    const options = {
        title: new RegExp(query, 'i'),
    };

    return Promise.all([
        Movie.find(options).skip(skipIndex).limit(limit),
        Movie.find().countDocuments(),
    ]);
};

exports.getMostLiked = async function () {
    let movies = await Movie.find({});
    movies = movies.sort((a, b) => {
        return b.likes.length - a.likes.length;
    });

    return movies.slice(0, 4);
    // return Movie.find({}).sort({ likes: -1 }).limit(4);
};

exports.getById = function (movieId) {
    return Movie.findById(movieId);
};

exports.create = async function (movieData) {
    const movie = new Movie({
        title: movieData.title,
        imageUrl: movieData.imageUrl,
        youtubeUrl: movieData.youtubeUrl,
        description: movieData.description,
        owner: movieData.owner,
    });

    await movie.save();

    return movie;
};

exports.updateById = async function (movieId, movieData) {
    const movie = await Movie.findById(movieId);

    movie.title = movieData.title;
    movie.imageUrl = movieData.imageUrl;
    movie.youtubeUrl = movieData.youtubeUrl;
    movie.description = movieData.description;

    await movie.save();

    return movie;
};

exports.deleteById = async function (movieId) {
    const deletedMovie = await Movie.findByIdAndRemove(movieId);
    return deletedMovie;
};

exports.like = async function (movieId, userId) {
    const movie = await Movie.findById(movieId);

    if (movie.likes.find((user) => user == userId)) {
        throw new Error('User already like this movie.');
    }

    movie.likes.push(userId);

    await movie.save();

    return movie;
};

exports.dislike = async function (movieId, userId) {
    const movie = await Movie.findById(movieId);

    movie.likes.pull(userId);

    await movie.save();

    return movie;
};

exports.addComment = async function (movieId, commentId) {
    const movie = await Movie.findById(movieId);

    movie.comments.push(commentId);

    await movie.save();

    return movie;
};

exports.getMyMovies = async function (userId) {
    const movies = await Movie.find({ owner: userId });

    return movies;
};
