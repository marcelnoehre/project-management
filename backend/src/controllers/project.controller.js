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
                const projectsRef = db.collection('projects').doc();
                const project = {
                    name: req.body.project,
                    history: [{
                        timestamp: new Date().getTime(),
                        type: 'CREATED',
                        username: req.body.username
                    }]
                };
                await projectsRef.set(project);
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
        const usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
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
                const projectsCollection = db.collection('projects');
                const historySnapshot = await projectsCollection.where('name', '==', req.body.project).get();
                if (historySnapshot.empty) {
                    res.status(500).send({ message: 'ERROR.INTERNAL' });
                } else {
                    const event = {
                        timestamp: new Date().getTime(),
                        type: 'INVITED',
                        username: jwt.decode(req.body.token).username
                    }
                    const historyDoc = historySnapshot.docs[0];
                    const history = historyDoc.data().history;
                    history.push(event);
                    await historyDoc.ref.update({
                        history: history
                    });
                }
                await notificationsService.createAdminNotification(db, req.body.project, jwt.decode(req.body.token).username, 'NOTIFICATIONS.NEW.INVITED', [jwt.decode(req.body.token).username, req.body.username], 'cancel');
                const user = userDoc.data();
                user.project = req.body.project;
                user.permission = 'INVITED';
                //TODO: return sorted list of all users
                res.json(user);
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
                const projectsCollection = db.collection('projects');
                const historySnapshot = await projectsCollection.where('name', '==', userDoc.data().project).get();
                if (historySnapshot.empty) {
                    res.status(500).send({ message: 'ERROR.INTERNAL' });
                } else {
                    const event = {
                        timestamp: new Date().getTime(),
                        type: 'JOINED',
                        username: req.body.username
                    }
                    const historyDoc = historySnapshot.docs[0];
                    const history = historyDoc.data().history;
                    history.push(event);
                    await historyDoc.ref.update({
                        history: history
                    });
                }
                await notificationsService.createTeamNotification(db, userDoc.data().project, req.body.username, 'NOTIFICATIONS.NEW.JOINED', [req.body.username], 'person_add');
                res.json({ message: 'SUCCESS.INVITE_ACCEPTED'});
            } else {
                await userDoc.ref.update({
                    project: '',
                    permission: ''
                });
                const projectsCollection = db.collection('projects');
                const historySnapshot = await projectsCollection.where('name', '==', userDoc.data().project).get();
                if (historySnapshot.empty) {
                    res.status(500).send({ message: 'ERROR.INTERNAL' });
                } else {
                    const event = {
                        timestamp: new Date().getTime(),
                        type: 'REJECTED',
                        username: req.body.username
                    }
                    const historyDoc = historySnapshot.docs[0];
                    const history = historyDoc.data().history;
                    history.push(event);
                    await historyDoc.ref.update({
                        history: history
                    });
                }
                await notificationsService.createAdminNotification(db, userDoc.data().project, req.body.username, 'NOTIFICATIONS.NEW.REJECTED', [req.body.username], 'cancel');
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
            await notificationsService.createTeamNotification(db, jwt.decode(req.body.token).project, jwt.decode(req.body.token).username, 'NOTIFICATIONS.NEW.REMOVED', [req.body.username, jwt.decode(req.body.token).username], 'person_remove');
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
            await notificationsService.createTeamNotification(db, jwt.decode(req.body.token).project, req.body.username, 'NOTIFICATIONS.NEW.LEAVE_PROJECT', [req.body.username], 'exit_to_app');
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