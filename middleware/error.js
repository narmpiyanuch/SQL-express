const errorMiddleware = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({ msg: err.msg });
};

module.exports = errorMiddleware