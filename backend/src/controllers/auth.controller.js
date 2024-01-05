const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
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
                const user = usersSnapshot.docs[0].data();
                if (user.project !== '') {
                    await usersSnapshot.docs[0].ref.update({
                        isLoggedIn: true
                    });
                }          
                user.token = jwt.sign(user, 'my-secret-key', { expiresIn: '1h' });
                user.isLoggedIn = true;
                res.json(user);
            }
        } else {
            res.status(401).send({ message: 'ERROR.INVALID_CREDENTIALS' });
        }
    } catch (err) {
        next(err);
    }
}

async function logout(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
        if (usersSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            await usersSnapshot.docs[0].ref.update({
                isLoggedIn: false
            });
            res.json( { message: "LOGIN.LOGOUT_SUCCESS" } );
        }
    } catch(err) {
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
                initials: req.body.initials,
                project: '',
                permission: '',
                profilePicture: '',
                isLoggedIn: false,
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

async function verify(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
        if (usersSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INVALID_TOKEN' });
        } else {
            const user = usersSnapshot.docs[0].data();
            user.token = req.body.token;
            res.json(user);
        }
    } catch(err) {
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
        if (usersSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const validAttributes = ['username', 'fullName', 'language', 'initials', 'profilePicture', 'password'];
            if (validAttributes.includes(req.body.attribute)) {
                if (req.body.attribute === 'password') {
                    const passwordsCollection = db.collection('passwords');
                    const passwordsSnapshot = await passwordsCollection.where('username', '==', req.body.username).get();
                    if (passwordsSnapshot.empty) {
                        res.status(500).send({ message: 'ERROR.INTERNAL' });
                    } else {
                        await passwordsSnapshot.docs[0].ref.update({ password: req.body.value });
                        res.json({ message: 'REGISTRATION.USER_UPDATE_SUCCESS' });
                    }
                } else {
                    if (req.body.attribute === 'username') {
                        const passwordsCollection = db.collection('passwords');
                        const passwordsSnapshot = await passwordsCollection.where('username', '==', req.body.username).get();
                        if (passwordsSnapshot.empty) {
                            res.status(500).send({ message: 'ERROR.INTERNAL' });
                        } else {
                            await passwordsSnapshot.docs[0].ref.update({ username: req.body.value });
                        }
                    }
                    await usersSnapshot.docs[0].ref.update({ [req.body.attribute]: req.body.value });
                    res.json({ message: 'REGISTRATION.USER_UPDATE_SUCCESS' });
                }
            } else {
                res.status(500).send({ message: 'ERROR.INTERNAL' });
            }
        }
    } catch (err) {
        next(err);
    }
}

async function deleteUser(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
        if (usersSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const passwordsCollection = db.collection('passwords');
            const passwordsSnapshot = await passwordsCollection.where('username', '==', req.body.username).get();
            if (passwordsSnapshot.empty) {
                res.status(500).send({ message: 'ERROR.INTERNAL' });
            } else {
                const userId = usersSnapshot.docs[0].id;
                await usersCollection.doc(userId).delete();
                const passwordId = passwordsSnapshot.docs[0].id;
                await passwordsCollection.doc(passwordId).delete();
                res.json({ message: 'REGISTRATION.DELETE_SUCCESS' });
            }
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    login,
    logout,
    register,
    verify,
    updateUser,
    deleteUser
};