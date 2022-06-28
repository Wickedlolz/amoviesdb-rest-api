const { getById } = require('../services/movie');

exports.isAuth = function () {
    return (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.status(401).json({ message: 'Please sign in.' });
        }
    };
};

exports.isGuest = function () {
    return (req, res, next) => {
        if (req.user) {
            res.status(403).json({ message: 'You already sign in.' });
        } else {
            next();
        }
    };
};

exports.isCreator = function () {
    return async (req, res, next) => {
        const movieId = req.params.id;
        const movie = await getById(movieId);

        if (movie.owner == req.user.id) {
            next();
        } else {
            res.status(401).json({ message: 'You cannot modify this record.' });
        }
    };
};
