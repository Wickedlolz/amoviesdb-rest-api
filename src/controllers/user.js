const router = require('express').Router();
const formidableMiddleware = require('express-formidable');

const userService = require('../services/user');
const { mapErrors } = require('../utils/mapErrors');
const { isGuest, isAuth } = require('../middlewares/guards');
const { body, validationResult } = require('express-validator');

router.post(
    '/register',
    body('firstName').trim(),
    body('lastName').trim(),
    body('username').trim(),
    body('email').trim(),
    body('password').trim(),
    body('firstName')
        .notEmpty()
        .withMessage('First Name is required.')
        .bail()
        .isLength({ min: 3 })
        .withMessage('First Name must be at least 3 characters long.'),
    body('lastName')
        .notEmpty()
        .withMessage('Last Name is required.')
        .bail()
        .withMessage('Last Name must be at least 3 characters long.'),
    body('username')
        .notEmpty()
        .withMessage('Username is required.')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long.')
        .bail()
        .custom((value) => /^[A-Za-z0-9]{3,}$/.test(value))
        .withMessage('Username must contains only letters and digits'),
    body('email')
        .notEmpty()
        .withMessage('Email is required.')
        .bail()
        .isEmail()
        .withMessage('Invalid email. Email format must be (example@yahoo.com)'),
    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Password must be at least 3 characters long.'),
    isGuest(),
    async (req, res) => {
        const { errors } = validationResult(req);

        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email.trim().toLocaleLowerCase(),
            password: req.body.password,
        };

        try {
            if (errors.length > 0) {
                throw errors;
            }

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
    }
);

router.post(
    '/login',
    body('email').trim(),
    body('password').trim(),
    body('email')
        .notEmpty()
        .withMessage('Email is required.')
        .bail()
        .isEmail()
        .withMessage('Invalid email. Email format must be (example@yahoo.com)'),
    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Password must be at least 3 characters long.'),
    isGuest(),
    async (req, res) => {
        const { errors } = validationResult(req);
        const data = {
            email: req.body.email.trim().toLocaleLowerCase(),
            password: req.body.password,
        };

        try {
            if (errors.length > 0) {
                throw errors;
            }

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
    }
);

router.get('/logout', isAuth(), (req, res) => {
    res.json({ message: 'Successfully logout.' });
});

router.get('/:userId', isAuth(), async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await userService.getById(userId);

        res.json(user);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

router.put('/:userId', isAuth(), formidableMiddleware(), async (req, res) => {
    const userId = req.params.userId;

    const data = {
        firstName: req.fields.firstName,
        lastName: req.fields.lastName,
        username: req.fields.username,
        email: req.fields.email,
        avatar: req.files.avatar,
    };

    try {
        const user = await userService.updateById(userId, data);

        res.status(201).json(user);
    } catch (error) {
        const errors = mapErrors(error);
        res.status(400).json({ message: errors });
    }
});

module.exports = router;
