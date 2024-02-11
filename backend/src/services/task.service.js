async function highestOrder(db, project, state) {
    const tasksCollection = db.collection('tasks');
    const tasksSnapshot = await tasksCollection
        .where('project', '==', project)
        .where('state', '==', state)
        .orderBy('order', 'desc').limit(1).get();
    return tasksSnapshot.empty ? 1 : (Math.ceil(tasksSnapshot.docs[0].data().order) + 1);
}

async function createTask(db, author, project, title, description, assigned, state, order) {
    const tasksCollection = db.collection('tasks');
    const newDocRef = tasksCollection.doc();
    const task = {
        uid: newDocRef.id,
        author: author,
        project: project,
        title: title,
        description: description,
        assigned: assigned,
        state: state,
        order: order,
        history: [{
            timestamp: new Date().getTime(),
            username: author,
            state: state,
            previous: null
        }]
    };
    return tasksCollection.doc(task.uid).set(task);
}

module.exports = { 
    highestOrder,
    createTask
};