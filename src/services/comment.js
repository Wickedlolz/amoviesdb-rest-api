const Comment = require('../models/Comment');

exports.create = async function (userId, movieId, content) {
    const comment = new Comment({
        author: userId,
        movieId,
        content,
    });

    await comment.save();

    return comment;
};
