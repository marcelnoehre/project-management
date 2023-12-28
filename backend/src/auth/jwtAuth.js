const jwt = require('jsonwebtoken');

exports.jwtAuth = (req, res, next) => {
    const token = req.body.token;
    try {
        jwt.verify(token, 'my-secret-key');
        next();
    } catch (err) {
        res.status(403).send({ message: 'ERROR.INVALID_TOKEN' });
    }
}