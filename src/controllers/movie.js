const router = require('express').Router();

const movieService = require('../services/movie');
const { mapErrors } = require('../utils/mapErrors');

router.get('/', async (req, res) => {
    try {
        const movies = await movieService.getAll();
        res.json(movies);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.post('/', async (req, res) => {
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
        const movie = await movieService.getById(movieId);
        res.json(movie);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

module.exports = router;
