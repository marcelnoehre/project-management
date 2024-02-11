const authService = require('../services/auth.service');
const projectService = require('../services/project.service');
const notificationsService = require('../services/notifications.service');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

async function createProject(req, res, next) {
    try {
        const token = req.body.token;
        const project = req.body.project;
        const tokenUser = jwt.decode(token);
        const user = authService.singleUser(db, tokenUser.username);
        if (user) {
            if (projectService.isNewProject(db, project)) {
                const promises = [];
                const userData = {
                    project: project,
                    permission: 'OWNER',
                    isLoggedIn: true
                };
                promises.push(authService.updateUserData(db, tokenUser.username, userData));
                promises.push(projectService.createProject(db, tokenUser.username, project));
                await Promise.all(promises);
                res.json({ message: "SUCCESS.CREATE_PROJECT" });
            } else {
                res.status(409).send({ message: 'ERROR.CREATE_PROJECT' });
            }
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch (err) {
        next(err);
    }
}

async function getTeamMembers(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const members = await projectService.getTeamMembers(db, tokenUser.project);
        if (members.length) {
            res.json(members);
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch (err) {
        next(err);
    }
}

async function inviteUser(req, res, next) {
    try {
        const token = req.body.token;
        const username = req.body.username;
        const tokenUser = jwt.decode(token);
        const user = authService.singleUser(db, username);
        if (user) {
            if (user.permission === 'INVITED') {
                res.status(423).send({ message: 'ERROR.PENDING_INVITE' });
            } else if (user.project !== '') {
                res.status(423).send({ message: 'ERROR.HAS_PROJECT' });
            } else {
                if (projectService.singleProject(db, tokenUser.project)) {
                    const promises = [];
                    const userData = {
                        project: tokenUser.project,
                        permission: 'INVITED'
                    };
                    const eventData = {
                        timestamp: new Date().getTime(),
                        type: 'INVITED',
                        username: tokenUser.username,
                        target: username
                    }
                    promises.push(authService.updateUserData(db, username, userData));
                    promises.push(projectService.updateProjectHistory(db, res, tokenUser.project, eventData));
                    promises.push(notificationsService.createAdminNotification(db, tokenUser.project, tokenUser.username, 'NOTIFICATIONS.NEW.INVITED', [tokenUser.username, username], 'cancel'));
                    await Promise.all(promises);
                    user.project = tokenUser.project;
                    user.permission = 'INVITED';
                    res.json(user);
                } else {
                    res.status(500).send({ message: 'ERROR.INTERNAL' });
                }
            }
        } else {
            res.status(404).send({ message: 'ERROR.NO_ACCOUNT' });
        }
    } catch (err) {
        next(err);
    }
}

async function handleInvite(req, res, next) {
    try {
        const token = req.body.token;
        const decision = req.body.decision;
        const tokenUser = jwt.decode(token);
        const user = authService.singleUser(db, tokenUser.username);
        if (user) {
            const promises = [];
            const userData = {
                project: decision ? user.project : '',
                permission: decision ? 'MEMBER' : ''
            }
            const eventData = {
                timestamp: new Date().getTime(),
                type: decision ? 'JOINED' : 'REJECTED',
                username: user.username,
                target: null
            }
            promises.push(authService.updateUserData(db, user.username, userData));
            promises.push(projectService.updateProjectHistory(db, user.project, eventData));
            if (decision) {
                promises.push(notificationsService.createTeamNotification(db, user.project, user.username, 'NOTIFICATIONS.NEW.JOINED', [user.username], 'person_add'));
            } else {
                promises.push(notificationsService.createAdminNotification(db, user.project, user.username, 'NOTIFICATIONS.NEW.REJECTED', [user.username], 'cancel'));
            }
            await Promise.all(promises);
            res.json({ message: decision ? 'SUCCESS.INVITE_ACCEPTED' : 'SUCCESS.INVITE_REJECTED' });
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch (err) {
        next(err);
    }
}

async function updatePermission(req, res, next) {
    try {
        const token = req.body.token;
        const username = req.body.username;
        const permission = req.body.permission;
        const tokenUser = jwt.decode(token);
        const user = authService.singleUser(db, username);
        if (user) {
            const promises = [];
            const userData = {
                permission: permission
            }
            const eventData = {
                timestamp: new Date().getTime(),
                type: permission,
                username: tokenUser.username,
                target: username
            }
            promises.push(this.authService.updateUserData(db, username, userData));
            promises.push(this.projectService.updateProjectHistory(db, tokenUser.project, eventData));
            await Promise.all(promises);
            res.json(await projectService.getTeamMembers(db, tokenUser.project));
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
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
            const projectsCollection = db.collection('projects');
            const historySnapshot = await projectsCollection.where('name', '==', userDoc.data().project).get();
            if (historySnapshot.empty) {
                res.status(500).send({ message: 'ERROR.INTERNAL' });
            } else {
                const event = {
                    timestamp: new Date().getTime(),
                    type: 'REMOVED',
                    username: jwt.decode(req.body.token).username,
                    target: req.body.username
                }
                const historyDoc = historySnapshot.docs[0];
                const history = historyDoc.data().history;
                history.push(event);
                await historyDoc.ref.update({
                    history: history
                });
            }
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
            const projectsCollection = db.collection('projects');
            const historySnapshot = await projectsCollection.where('name', '==', userDoc.data().project).get();
            if (historySnapshot.empty) {
                res.status(500).send({ message: 'ERROR.INTERNAL' });
            } else {
                const event = {
                    timestamp: new Date().getTime(),
                    type: 'LEFT',
                    username: req.body.username,
                    target: null
                }
                const historyDoc = historySnapshot.docs[0];
                const history = historyDoc.data().history;
                history.push(event);
                await historyDoc.ref.update({
                    history: history
                });
            }
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