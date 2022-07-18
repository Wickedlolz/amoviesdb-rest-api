const express = require('express');
const cors = require('cors');
const auth = require('../middlewares/auth');

const whitelist = [
    'http://localhost:3000',
    'https://amoviesdb.web.app/',
    'https://www.youtube.com',
];

module.exports = (app) => {
    app.use('/public', express.static('public'));
    app.use(express.json());
    app.use(cors({ origin: whitelist, credentials: true }));
    app.use(auth());
};
