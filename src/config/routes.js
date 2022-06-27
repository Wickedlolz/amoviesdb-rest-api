const router = require('express').Router();

const movieController = require('../controllers/movie');
const userController = require('../controllers/user');

router.get('/', (req, res) => {
    res.json({ message: 'AMoviesDB Service operational.' });
});
router.use('/api/catalog', movieController);
router.use('/api/users', userController);
router.all('*', (req, res) =>
    res.status(400).json({ message: 'Resourse not found.' })
);

module.exports = router;
