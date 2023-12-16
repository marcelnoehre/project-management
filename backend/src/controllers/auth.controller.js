async function login(req, res, next) {
    try {
        if(req.body.username === 'mock' && req.body.password === 'mock') {
            res.json({
                token: 1634113024,
                username: "mock",
                fullName: "Mock User",
                language: "de-DE",
                isLoggedIn: true
        });
        } else {
            res.status(401).send({ error: "Invalid credentials!" });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    login
};