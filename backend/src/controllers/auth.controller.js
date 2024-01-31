const authService = require('../services/auth.service');
const notificationsService = require('../services/notifications.service');
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
                user.token = jwt.sign(user, 'my-secret-key', { expiresIn: '1h' });
                user.isLoggedIn = user.project !== '' && user.permission !== 'INVITED';
                res.json(user);
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
            const initials = authService.generateInitials(req.body.fullName);
            const color = authService.defaultColor();
            const user = {
                username: req.body.username,
                fullName: req.body.fullName,
                language: req.body.language,
                initials: initials,
                color: color,
                project: '',
                permission: '',
                profilePicture: '',
                notificationsEnabled: true,
                stats: {
                    created: 0,
                    imported: 0,
                    edited: 0,
                    trashed: 0,
                    restored: 0,
                    deleted: 0,
                    cleared: 0
                }
            }
            const usersRef = db.collection('users').doc();
            await usersRef.set(user);
            const password = {
                username: req.body.username,
                password: req.body.password
            }
            const passwordsRef = db.collection('passwords').doc();
            await passwordsRef.set(password);
            res.json({ message: "SUCCESS.REGISTRATION" });
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
            res.status(403).send({ message: 'ERROR.INVALID_TOKEN' });
        } else {
            const user = usersSnapshot.docs[0].data();
            user.token = req.body.token;
            user.isLoggedIn = user.project !== '' && user.permission !== 'INVITED';
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
            const validAttributes = ['username', 'fullName', 'language', 'initials', 'color', 'profilePicture', 'password'];
            if (validAttributes.includes(req.body.attribute)) {
                if (req.body.attribute === 'password') {
                    const passwordsCollection = db.collection('passwords');
                    const passwordsSnapshot = await passwordsCollection.where('username', '==', req.body.username).get();
                    if (passwordsSnapshot.empty) {
                        res.status(500).send({ message: 'ERROR.INTERNAL' });
                    } else {
                        await passwordsSnapshot.docs[0].ref.update({ password: req.body.value });
                        res.json({ message: 'SUCCESS.UPDATE_ACCOUNT' });
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
                    res.json({ message: 'SUCCESS.UPDATE_ACCOUNT' });
                }
            } else {
                res.status(500).send({ message: 'ERROR.INTERNAL' });
            }
        }
    } catch (err) {
        next(err);
    }
}

async function toggleNotifications(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
        if (usersSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            await usersSnapshot.docs[0].ref.update({
                notificationsEnabled: req.body.notificationsEnabled
            });
            let msg = req.body.notificationsEnabled ? 'SUCCESS.NOTIFICATIONS_ON' : 'SUCCESS.NOTIFICATIONS_OFF';
            res.json({ message: msg });
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
                await notificationsService.createTeamNotification(db, jwt.decode(req.body.token).project, req.body.username, 'NOTIFICATIONS.NEW.LEAVE_PROJECT', [req.body.username], 'exit_to_app');
                res.json({ message: 'SUCCESS.DELETE_ACCOUNT' });
            }
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    login,
    register,
    verify,
    updateUser,
    toggleNotifications,
    deleteUser
};