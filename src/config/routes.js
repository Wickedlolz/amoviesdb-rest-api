const router = require('express').Router();

const movieController = require('../controllers/movie');

router.get('/', (req, res) => {
    res.json({ message: 'AMoviesDB Service operational.' });
});
router.use('/api/catalog', movieController);

module.exports = router;
