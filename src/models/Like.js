const {
    Schema,
    model,
    Types: { ObjectId },
} = require('mongoose');

const likeSchema = new Schema({
    userId: { type: ObjectId, ref: 'User' },
});

const Like = model('Like', likeSchema);
