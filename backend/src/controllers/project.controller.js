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
                    permission: 'ADMIN'
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

async function getTeamMembers(req, res, next) {
    try {
        res.status(500).send({ message: 'ERROR.INTERNAL' });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createProject,
    getTeamMembers
};