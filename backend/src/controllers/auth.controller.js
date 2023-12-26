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
            res.status(401).send({ message: 'ERROR.INVALID_CREDENTIALS' });
        }
    } catch (err) {
        next(err);
    }
}

async function register(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
        if (usersSnapshot.empty) {
            const user = {
                username: req.body.username,
                fullName: req.body.fullName,
                language: req.body.language,
                project: '',
                role: '',
                isLoggedIn: true
            }
            const usersRef = db.collection('users').doc();
            await usersRef.set(user);
            const password = {
                username: req.body.username,
                password: req.body.password
            }
            const passwordsRef = db.collection('passwords').doc();
            await passwordsRef.set(password);
            res.json({ message: "REGISTRATION.SUCCESS" });
        } else {
            res.status(402).send({ message: 'ERROR.USERNAME_TAKEN' });
        }
    } catch (err) {
        next(err);
    }
}

async function createProject(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
        if (usersSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const projectSnapshot = await usersCollection.where('project', '==', req.body.project).get();
            if (projectSnapshot.empty) {
                const userDoc = usersSnapshot.docs[0];
                await userDoc.ref.update({
                    project: req.body.project
                });
                res.json({ message: "CREATE_PROJECT.SUCCESS" });
            } else {
                res.status(403).send({ message: 'ERROR.CREATE_PROJECT' });
            }
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    login,
    register,
    createProject
};