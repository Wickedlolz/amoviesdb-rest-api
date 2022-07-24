const router = require('express').Router();

const movieService = require('../services/movie');
const commentService = require('../services/comment');
const { mapErrors } = require('../utils/mapErrors');
const { isAuth, isCreator } = require('../middlewares/guards');
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    const query = req.query.search;
    const page = parseInt(req.query?.page) || 1;
    const limit = 8;
    const skipIndex = (page - 1) * limit;

    try {
        const movies = await movieService.getAll(query, skipIndex, limit);
        res.json(movies);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.get('/most-liked', async (req, res) => {
    try {
        const mostLikedMovies = await movieService.getMostLiked();
        res.json(mostLikedMovies);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.get('/my-movies/:userId', isAuth(), async (req, res) => {
    const userId = req.params.userId;

    try {
        const myMovies = await movieService.getMyMovies(userId);
        res.json(myMovies);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.post(
    '/',
    body('title').trim(),
    body('imageUrl').trim(),
    body('youtubeUrl').trim(),
    body('description').trim(),
    body('title')
        .notEmpty()
        .withMessage('Title is required.')
        .bail()
        .isLength({ max: 100 })
        .withMessage('Title must be maximum 100 characters long.'),
    body('imageUrl')
        .notEmpty()
        .withMessage('Image URL is required.')
        .bail()
        .custom(
            (value) => value.startsWith('http') || value.startsWith('https')
        )
        .withMessage('Image URL must start with http:// or https://.'),
    body('youtubeUrl')
        .notEmpty()
        .withMessage('YouTube URL is required.')
        .bail()
        .custom(
            (value) => value.startsWith('http') || value.startsWith('https')
        )
        .withMessage('YouTube URL must start with http:// or https://'),
    body('description').notEmpty().withMessage('Description is required.'),
    isAuth(),
    async (req, res) => {
        const { errors } = validationResult(req);
        const userId = req.user.id;

        const data = {
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            youtubeUrl: req.body.youtubeUrl,
            description: req.body.description,
            owner: userId,
        };

        try {
            if (errors.length > 0) {
                throw errors;
            }

            const movie = await movieService.create(data);
            res.status(201).json(movie);
        } catch (error) {
            const errors = mapErrors(error);
            res.status(400).json({ message: errors });
        }
    }
);

router.get('/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        const movie = await movieService
            .getById(movieId)
            .populate('owner')
            // .populate('likes')
            .populate({ path: 'comments', populate: { path: 'author' } })
            .lean();

        const modifiedOwner = {
            avatar: movie.owner.avatar,
            createdAt: movie.owner.createdAt,
            email: movie.owner.email,
            firstName: movie.owner.firstName,
            lastName: movie.owner.lastName,
            updatedAt: movie.owner.updatedAt,
            username: movie.owner.username,
        };

        const modifiedMovie = { ...movie, owner: modifiedOwner };

        res.json(modifiedMovie);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.put(
    '/:id',
    body('title').trim(),
    body('imageUrl').trim(),
    body('youtubeUrl').trim(),
    body('description').trim(),
    body('title')
        .notEmpty()
        .withMessage('Title is required.')
        .bail()
        .isLength({ max: 100 })
        .withMessage('Title must be maximum 100 characters long.'),
    body('imageUrl')
        .notEmpty()
        .withMessage('Image URL is required.')
        .bail()
        .custom(
            (value) => value.startsWith('http') || value.startsWith('https')
        )
        .withMessage('Image URL must start with http:// or https://.'),
    body('youtubeUrl')
        .notEmpty()
        .withMessage('YouTube URL is required.')
        .bail()
        .custom(
            (value) => value.startsWith('http') || value.startsWith('https')
        )
        .withMessage('YouTube URL must start with http:// or https://'),
    body('description').notEmpty().withMessage('Description is required.'),
    isAuth(),
    isCreator(),
    async (req, res) => {
        const movieId = req.params.id;
        const { errors } = validationResult(req);

        const data = {
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            youtubeUrl: req.body.youtubeUrl,
            description: req.body.description,
        };

        try {
            if (errors.length > 0) {
                throw errors;
            }

            const updatedMovie = await movieService.updateById(movieId, data);
            res.status(201).json(updatedMovie);
        } catch (error) {
            const errors = mapErrors(error);
            res.status(400).json({ message: errors });
        }
    }
);

router.delete('/:id', isAuth(), isCreator(), async (req, res) => {
    const movieId = req.params.id;

    try {
        const deletedMovie = await movieService.deleteById(movieId);
        res.json(deletedMovie);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.post('/like/:id', isAuth(), async (req, res) => {
    const movieId = req.params.id;

    try {
        const movie = await movieService.like(movieId, req.user.id);

        res.status(201).json(movie);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.post('/dislike/:id', isAuth(), async (req, res) => {
    const movieId = req.params.id;

    try {
        const movie = await movieService.dislike(movieId, req.user.id);

        res.status(201).json(movie);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.post(
    '/comments/:id',
    body('content').trim(),
    body('content').notEmpty().withMessage('Comment field is empty.'),
    isAuth(),
    async (req, res) => {
        const { errors } = validationResult(req);
        const movieId = req.params.id;
        const userId = req.user.id;
        const content = req.body.content;

        try {
            if (errors.length > 0) {
                throw errors;
            }

            const comment = await commentService.create(
                userId,
                movieId,
                content
            );
            await movieService.addComment(movieId, comment._id);

            res.status(201).json(comment);
        } catch (error) {
            const errors = mapErrors(error);
            res.status(400).json({ message: errors });
        }
    }
);

module.exports = router;
