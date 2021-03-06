const {
    Schema,
    model,
    Types: { ObjectId },
} = require('mongoose');

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        avatar: {
            type: String,
            default:
                'https://amoviesdb-rest-api.herokuapp.com/public/images/profile-icon.png',
        },
        myMovies: [{ type: ObjectId, ref: 'Movie' }],
    },
    { timestamps: true }
);

userSchema.index(
    { email: 1 },
    {
        unique: true,
        collation: {
            locale: 'en',
            strength: 2,
        },
    }
);

const User = model('User', userSchema);

module.exports = User;
