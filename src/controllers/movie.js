const router = require('express').Router();

const movieService = require('../services/movie');
const commentService = require('../services/comment');
const { mapErrors } = require('../utils/mapErrors');
const { isAuth } = require('../middlewares/guards');

router.get('/', async (req, res) => {
    try {
        const movies = await movieService.getAll();
        res.json(movies);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.post('/', isAuth(), async (req, res) => {
    const data = {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
    };

    try {
        const movie = await movieService.create(data);
        res.status(201).json(movie);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.get('/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        const movie = await movieService
            .getById(movieId)
            .populate('likes')
            .populate({ path: 'comments', populate: { path: 'author' } });

        res.json(movie);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.put('/:id', isAuth(), async (req, res) => {
    const movieId = req.params.id;

    const data = {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
    };

    try {
        const updatedMovie = await movieService.updateById(movieId, data);
        res.status(201).json(updatedMovie);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.delete('/:id', isAuth(), async (req, res) => {
    const movieId = req.params.id;
    console.log('DELETE Record');

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
        await movieService.like(movieId, req.user.id);

        res.status(201).json({ message: 'Like added.' });
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.post('/dislike/:id', isAuth(), async (req, res) => {
    const movieId = req.params.id;

    try {
        await movieService.dislike(movieId, req.user.id);

        res.status(201).json({ message: 'Disliked successfully.' });
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.post('/comments/:id', isAuth(), async (req, res) => {
    const movieId = req.params.id;
    const userId = req.user.id;
    const content = req.body.content.trim();

    try {
        const comment = await commentService.create(userId, movieId, content);
        await movieService.addComment(movieId, comment._id);

        res.status(201).json(comment);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

module.exports = router;
