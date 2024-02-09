const authService = require('../services/auth.service');
const notificationsService = require('../services/notifications.service');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

/**
 * Handles user authentication and login.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if authentication fails.
 * - 401: INVALID_CREDENTIALS
 * - 500: INTERNAL
 *
 * @returns {void}
 */
async function login(req, res, next) {
    try {
        const username = req.body.username;
        const password = req.body.password;
        if (await authService.passwordValid(db, username, password)) {
            const user = await authService.singleUser(db, username);
            if (user) {
                user.token = jwt.sign(user, '3R#q!ZuFb2sPn8yT^@5vLmN7jA*C6hG', { expiresIn: '1h' });
                user.isLoggedIn = user.project !== '' && user.permission !== 'INVITED';
                res.json(user);
            } else {
                res.status(500).send({ message: 'ERROR.INTERNAL' });
            }
        } else {
            res.status(401).send({ message: 'ERROR.INVALID_CREDENTIALS' });
        }
    } catch (err) {
        next(err);
    }
}

/**
 * Handles user registration.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if registration fails.
 * - 402: USERNAME_TAKEN
 *
 * @returns {void}
 */
async function register(req, res, next) {
    try {
        const username = req.body.username;
        const fullName = req.body.fullName;
        const language = req.body.language;
        const password = req.body.password;
        if (await authService.isNewUser(db, username)) {
            await authService.createUser(db, username, fullName, language, password);
            res.json({ message: "SUCCESS.REGISTRATION" });
        } else {
            res.status(402).send({ message: 'ERROR.USERNAME_TAKEN' });
        }
    } catch (err) {
        next(err);
    }
}

/**
 * Verifies a user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if user is invalid.
 * - 403: INVALID_TOKEN
 *
 * @returns {void}
 */
async function verify(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const user = await authService.singleUser(db, tokenUser.username);
        if (user) {
            user.token = token;
            user.isLoggedIn = user.project !== '' && user.permission !== 'INVITED';
            res.json(user);
        } else {
            res.status(403).send({ message: 'ERROR.INVALID_TOKEN' });
        }
    } catch(err) {
        next(err);
    }
}

/**
 * Upadates a user attribute.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if update fails.
 * - 500: INTERNAL
 *
 * @returns {void}
 */
async function updateUser(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const user = authService.singleUser(db, tokenUser.username);
        if (user && await authService.updateAttribute()) {
            res.json({ message: 'SUCCESS.UPDATE_ACCOUNT' });
        }
        res.status(500).send({ message: 'ERROR.INTERNAL' });
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