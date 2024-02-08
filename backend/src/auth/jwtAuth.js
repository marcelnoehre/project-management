const jwt = require('jsonwebtoken');

exports.jwtAuth = (req, res, next) => {
    const token = req.body.token;
    try {
        jwt.verify(token, '3R#q!ZuFb2sPn8yT^@5vLmN7jA*C6hG');
        next();
    } catch (err) {
        res.status(403).send({ message: 'ERROR.INVALID_TOKEN' });
    }
}