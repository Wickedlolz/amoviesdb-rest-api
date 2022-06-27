const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({ message: 'AMoviesDB Service operational.' });
});

module.exports = router;
