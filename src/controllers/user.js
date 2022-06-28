const router = require('express').Router();

const userService = require('../services/user');
const { mapErrors } = require('../utils/mapErrors');

router.post('/register', async (req, res) => {
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email.trim().toLocaleLowerCase(),
        password: req.body.password,
    };

    try {
        const user = await userService.register(data);
        const token = await userService.createToken(user);

        const result = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            id: user._id,
            accessToken: token,
        };

        res.status(201).json(result);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.post('/login', async (req, res) => {
    const data = {
        email: req.body.email.trim().toLocaleLowerCase(),
        password: req.body.password,
    };

    try {
        const user = await userService.login(data.email, data.password);
        const token = await userService.createToken(user);

        const result = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            id: user._id,
            accessToken: token,
        };

        res.status(201).json(result);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

module.exports = router;