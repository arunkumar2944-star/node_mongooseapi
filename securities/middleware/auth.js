const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).send({
                message: 'Token not found'
            });
        }

        const token = authHeader.replace('Bearer ', '');

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).send({
            message: 'Invalid token'
        });
    }
};

module.exports = auth;