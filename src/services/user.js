const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { hash, compare } = require('bcrypt');
const { SALT_ROUNDS, JWT_SECRET } = require('../config/constants');

exports.register = async function (userData) {
    const existing = await getUserByEmail(userData.email);

    if (existing) {
        throw new Error('Email is taken.');
    }

    const hashedPassword = await hash(userData.password, SALT_ROUNDS);

    const user = new User({
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
    });

    await user.save();

    return user;
};

exports.login = async function (email, password) {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new Error('Incorrect email or password.');
    }

    const isIdentical = await compare(password, user.password);

    if (!isIdentical) {
        throw new Error('Incorrect email or password.');
    }

    return user;
};

exports.createToken = function (user) {
    const tokenPromise = new Promise((resolve, reject) => {
        const payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            id: user._id,
        };

        jwt.sign(payload, JWT_SECRET, (error, token) => {
            if (error) {
                return reject(error);
            }

            resolve(token);
        });
    });

    return tokenPromise;
};

async function getUserByEmail(email) {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    return user;
}
