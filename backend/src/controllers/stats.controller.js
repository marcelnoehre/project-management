const admin = require('firebase-admin');
const db = admin.firestore();

async function optimize(req, res, next) {
    try {

    } catch (err) {
        next(err);
    }
}

module.exports = {
    optimize
};