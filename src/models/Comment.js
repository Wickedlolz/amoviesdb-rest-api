const {
    Schema,
    model,
    Types: { ObjectId },
} = require('mongoose');

const commentSchema = new Schema(
    {
        movieId: { type: ObjectId, ref: 'Movie' },
        author: { type: ObjectId, ref: 'User' },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

const Comment = model('Comment', commentSchema);

module.exports = Comment;
