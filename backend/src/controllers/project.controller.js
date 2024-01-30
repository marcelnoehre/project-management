const notificationsService = require('../services/notifications.service');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

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
                    project: req.body.project,
                    permission: 'OWNER',
                    isLoggedIn: true
                });
                res.json({ message: "SUCCESS.CREATE_PROJECT" });
            } else {
                res.status(402).send({ message: 'ERROR.CREATE_PROJECT' });
            }
        }
    } catch (err) {
        next(err);
    }
}

async function getTeamMembers(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('project', '==', req.body.project).get();
        if (usersSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const users = [];
            usersSnapshot.forEach(doc => {
                users.push(doc.data());
            });
            res.json(users);
        }
    } catch (err) {
        next(err);
    }
}

async function inviteUser(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        let usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
        if (usersSnapshot.empty) {
            res.status(404).send({ message: 'ERROR.NO_ACCOUNT' });
        } else {
            const userDoc = usersSnapshot.docs[0];
            if (userDoc.data().permission === 'INVITED') {
                res.status(404).send({ message: 'ERROR.PENDING_INVITE' });
            } else if (userDoc.data().project !== '') {
                res.status(404).send({ message: 'ERROR.HAS_PROJECT' });
            } else {
                await userDoc.ref.update({
                    project: req.body.project,
                    permission: 'INVITED'
                });
                usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
                res.json(usersSnapshot.docs[0].data());
            }
        }
    } catch (err) {
        next(err);
    }
}

async function handleInvite(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
        if (usersSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const userDoc = usersSnapshot.docs[0];
            if (req.body.decision) {
                await userDoc.ref.update({
                    permission: 'MEMBER',
                    isLoggedIn: true
                });
                await notificationsService.createNotification(db, userDoc.data().project, req.body.username, 'NOTIFICATIONS.NEW.JOINED', [req.body.username], 'person_add');
                res.json({ message: 'SUCCESS.INVITE_ACCEPTED'});
            } else {
                await userDoc.ref.update({
                    project: '',
                    permission: ''
                });
                res.json({ message: 'SUCCESS.INVITE_REJECTED'});
            }
        }
    } catch (err) {
        next(err);
    }
}

async function updatePermission(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const userSnapshot = await usersCollection.where('username', '==', req.body.username).get();
        if (userSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            await userSnapshot.docs[0].ref.update({
                permission: req.body.permission
            });
            const usersSnapshot = await usersCollection.where('project', '==', req.body.project).get();
            const users = [];
            usersSnapshot.forEach(doc => {
                users.push(doc.data());
            });
            res.json(users);
        }
    } catch (err) {
        next(err);
    }
}

async function removeUser(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
        if (usersSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const userDoc = usersSnapshot.docs[0];
            await userDoc.ref.update({
                project: '',
                permission: ''
            });
            await notificationsService.createNotification(db, jwt.decode(req.body.token).project, jwt.decode(req.body.token).username, 'NOTIFICATIONS.NEW.REMOVED', [req.body.username, jwt.decode(req.body.token).username], 'person_remove');
            res.json({message: 'SUCCESS.REMOVE_MEMBER'});
        }
    } catch (err) {
        next(err);
    }
}

async function leaveProject(req, res, next) {
    try {
        const usersCollection = db.collection('users');
        const usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
        if (usersSnapshot.empty) {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        } else {
            const userDoc = usersSnapshot.docs[0];
            await userDoc.ref.update({
                project: '',
                permission: ''
            });
            await notificationsService.createNotification(db, jwt.decode(req.body.token).project, req.body.username, 'NOTIFICATIONS.NEW.LEAVE_PROJECT', [req.body.username], 'exit_to_app');
            res.json({message: 'SUCCESS.LEAVE_PROJECT'});
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createProject,
    getTeamMembers,
    inviteUser,
    handleInvite,
    updatePermission,
    removeUser,
    leaveProject
};