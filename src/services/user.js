const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { hash, compare } = require('bcrypt');
const { SALT_ROUNDS, JWT_SECRET } = require('../config/constants');
const { uploadFile } = require('../utils/disk');

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

exports.getById = async function (userId) {
    const user = await User.findById(userId);

    return user;
};

exports.updateById = async function (userId, userData) {
    const user = await User.findById(userId);

    if (userData.avatar.name !== '') {
        const proflePictureId = await uploadFile(userData.avatar);
        const proflePicture = `https://drive.google.com/uc?id=${proflePictureId}`;

        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        user.username = userData.username;
        user.email = userData.email;
        user.avatar = proflePicture;

        await user.save();

        return user;
    } else {
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        user.username = userData.username;
        user.email = userData.email;

        await user.save();

        return user;
    }
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

exports.validateToken = function (token) {
    return jwt.verify(token, JWT_SECRET, function (error, decoded) {
        if (error) {
            throw new Error(error.message);
        }

        return decoded;
    });
};

async function getUserByEmail(email) {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    return user;
}
