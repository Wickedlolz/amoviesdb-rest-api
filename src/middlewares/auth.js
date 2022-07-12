const { validateToken } = require('../services/user');

module.exports = function () {
    return (req, res, next) => {
        const token = req.headers['x-authorization'];

        if (token) {
            try {
                const payload = validateToken(token);

                req.user = {
                    email: payload.email,
                    id: payload.id,
                    token,
                };
            } catch (error) {
                return res
                    .status(403)
                    .json({ message: 'Invalid access token. Please sign in.' });
            }
        }

        next();
    };
};
