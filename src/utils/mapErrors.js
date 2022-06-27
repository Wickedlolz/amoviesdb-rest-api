exports.mapErrors = function (error) {
    if (Array.isArray(error)) {
        return error.join('\n');
    } else if (error.name == 'ValidationError') {
        return Object.values(error.errors)
            .map((e) => e.message)
            .join('\n');
    } else if (typeof error.message == 'string') {
        return error.message;
    } else {
        return 'Request error.';
    }
};
