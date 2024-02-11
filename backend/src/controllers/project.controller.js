const authService = require('../services/auth.service');
const projectService = require('../services/project.service');
const notificationsService = require('../services/notifications.service');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const db = admin.firestore();

/**
 * Creates a project.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if creation fails.
 * - 409: CREATE_PROJECT
 * - 500: INTERNAL
 *
 * @returns {void}
 */
async function createProject(req, res, next) {
    try {
        const token = req.body.token;
        const project = req.body.project;
        const tokenUser = jwt.decode(token);
        const user = await authService.singleUser(db, tokenUser.username);
        if (user) {
            if (await projectService.isNewProject(db, project)) {
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

/**
 * Get a sorted list of team members.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if retrieval fails.
 * - 500: INTERNAL
 *
 * @returns {void}
 */
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

/**
 * Marks a user as invited.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if invite fails.
 * - 404: NO_ACCOUNT
 * - 423: PENDING_INVITE
 * - 423: HAS_PROJECT
 * - 500: INTERNAL
 *
 * @returns {void}
 */
async function inviteUser(req, res, next) {
    try {
        const token = req.body.token;
        const username = req.body.username;
        const tokenUser = jwt.decode(token);
        const user = await authService.singleUser(db, username);
        if (user) {
            if (user.permission === 'INVITED') {
                res.status(423).send({ message: 'ERROR.PENDING_INVITE' });
            } else if (user.project !== '') {
                res.status(423).send({ message: 'ERROR.HAS_PROJECT' });
            } else {
                if (await projectService.singleProject(db, tokenUser.project)) {
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
                    promises.push(projectService.updateProjectHistory(db, tokenUser.project, eventData));
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

/**
 * Updates a invite.
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
async function handleInvite(req, res, next) {
    try {
        const token = req.body.token;
        const decision = req.body.decision;
        const tokenUser = jwt.decode(token);
        const user = await authService.singleUser(db, tokenUser.username);
        if (user && await projectService.singleProject(db, tokenUser.project)) {
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

/**
 * Updates a user permission.
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
async function updatePermission(req, res, next) {
    try {
        const token = req.body.token;
        const username = req.body.username;
        const permission = req.body.permission;
        const tokenUser = jwt.decode(token);
        const user = await authService.singleUser(db, username);
        if (user && await projectService.singleProject(db, tokenUser.project)) {
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
            promises.push(authService.updateUserData(db, username, userData));
            promises.push(projectService.updateProjectHistory(db, tokenUser.project, eventData));
            await Promise.all(promises);
            res.json(await projectService.getTeamMembers(db, tokenUser.project));
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch (err) {
        next(err);
    }
}

/**
 * Removes a user from the project.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if removal fails.
 * - 500: INTERNAL
 *
 * @returns {void}
 */
async function removeUser(req, res, next) {
    try {
        const token = req.body.token;
        const username = req.body.username;
        const tokenUser = jwt.decode(token);
        const user = await authService.singleUser(db, username);
        if (user && await projectService.singleProject(db, tokenUser.project)) {
            const promises = [];
            const userData = {
                project: '',
                permission: ''
            }
            const eventData = {
                timestamp: new Date().getTime(),
                type: 'REMOVED',
                username: tokenUser.username,
                target: username
            }
            promises.push(authService.updateUserData(db, username, userData));
            promises.push(projectService.updateProjectHistory(db, tokenUser.project, eventData));
            promises.push(notificationsService.createTeamNotification(db, tokenUser.project, tokenUser.username, 'NOTIFICATIONS.NEW.REMOVED', [username, tokenUser.username], 'person_remove'));
            await Promise.all(promises);
            res.json({message: 'SUCCESS.REMOVE_MEMBER'});
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
        }
    } catch (err) {
        next(err);
    }
}

/**
 * Removes a user from the project.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} - Throws an error if removal fails.
 * - 500: INTERNAL
 *
 * @returns {void}
 */
async function leaveProject(req, res, next) {
    try {
        const token = req.body.token;
        const tokenUser = jwt.decode(token);
        const user = await authService.singleUser(db, tokenUser.username);
        if (user && await projectService.singleProject(db, tokenUser.project)) {
            const promises = [];
            const userData = {
                project: '',
                permission: ''
            }
            const eventData = {
                timestamp: new Date().getTime(),
                type: 'LEFT',
                username: tokenUser.username,
                target: null
            }
            promises.push(authService.updateUserData(db, tokenUser.username, userData));
            promises.push(projectService.updateProjectHistory(db, tokenUser.project, eventData));
            promises.push(notificationsService.createTeamNotification(db, tokenUser.project, tokenUser.username, 'NOTIFICATIONS.NEW.LEAVE_PROJECT', [tokenUser.username], 'exit_to_app'));
            await Promise.all(promises);
            res.json({message: 'SUCCESS.LEAVE_PROJECT'});
        } else {
            res.status(500).send({ message: 'ERROR.INTERNAL' });
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