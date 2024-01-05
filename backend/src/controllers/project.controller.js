const admin = require('firebase-admin');
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
                    permission: 'OWNER'
                });
                res.json({ message: "CREATE_PROJECT.SUCCESS" });
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
            res.status(404).send({ message: 'ERROR.NO_USER' });
        } else {
            const userDoc = usersSnapshot.docs[0];
            await userDoc.ref.update({
                project: req.body.project,
                permission: 'INVITED'
            });
            usersSnapshot = await usersCollection.where('username', '==', req.body.username).get();
            res.json(usersSnapshot.docs[0].data());
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
                    permission: 'MEMBER'
                });
                res.json({ message: 'LOGIN.INVITE_ACCEPTED'});
            } else {
                await userDoc.ref.update({
                    project: '',
                    permission: ''
                });
                res.json({ message: 'LOGIN.INVITE_REJECTED'});
            }
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
            res.json({message: 'PROJECT_SETTINGS.REMOVE_SUCCESS'});
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
    removeUser
};