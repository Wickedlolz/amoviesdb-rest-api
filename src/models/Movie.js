const {
    Schema,
    model,
    Types: { ObjectId },
} = require('mongoose');

const movieSchema = new Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: ObjectId, ref: 'User' },
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [{ type: ObjectId, ref: 'Comment' }],
});

const Movie = model('Movie', movieSchema);

module.exports = Movie;
