const admin = require('firebase-admin');
const db = admin.firestore();

async function login(req, res, next) {
    try {
        const passwordsCollection = db.collection('passwords');
        const passwordsSnapshot = await passwordsCollection.where('username', '==', req.body.username).get();
        if (passwordsSnapshot.empty) {
            res.status(401).send({ message: 'ERROR.INVALID_CREDENTIALS' });
        } else if (passwordsSnapshot.docs[0].data().password === req.body.password) {
            const usersCollection = db.collection('users');
            const usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
            if (usersSnapshot.empty) {
                res.status(500).send({ message: 'ERROR.INTERNAL' });
            } else {
                res.json(usersSnapshot.docs[0].data());
            }
        } else {
            res.status(401).send({ message: "ERROR.INVALID_CREDENTIALS" });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    login
};