const mongoose = require('mongoose');
const { DB_CONNECTION } = require('./constants');

module.exports = async () => {
    try {
        await mongoose.connect(DB_CONNECTION);
        console.log('Database connected.');

        mongoose.connection.on('error', (error) => {
            console.log('Database error:');
            console.error(error);
        });
    } catch (error) {
        console.log('Database connection error:');
        console.error(error);
        process.exit(1);
    }
};
