const express = require('express');
const cors = require('cors');

module.exports = (app) => {
    app.use('/public', express.static('public'));
    app.use(express.json());
    app.use(cors());
};
