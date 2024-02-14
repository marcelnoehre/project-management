const jwt = require('jsonwebtoken');

function get(req, res, next) {
    jwtAuth(req.query.token, res, next);
}

function post(req, res, next) {
    jwtAuth(req.body.token, res, next);
}

function jwtAuth(token, res, next) {
    try {
        jwt.verify(token, '3R#q!ZuFb2sPn8yT^@5vLmN7jA*C6hG');
        next();
    } catch (err) {
        res.status(403).send({ message: 'ERROR.INVALID_TOKEN' });
    }
}

module.exports = {
    get,
    post
};