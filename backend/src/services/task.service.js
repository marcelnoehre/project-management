async function singleTask(db, uid) {
    const tasksCollection = db.collection('tasks');
    const tasksSnapshot = await tasksCollection.where('uid', '==', uid).get();
    if (tasksSnapshot.size === 1) {
        return tasksSnapshot.docs[0].data();
    } else {
        return null;
    }
}

async function getTaskList(db, project) {
    const tasksCollection = db.collection('tasks');
    const tasksSnapshot = await tasksCollection
        .where('project', '==', project)
        .where('state', '!=', 'DELETED')
        .orderBy('state')
        .orderBy('order')
        .get();
    const tasks = [
        { state: 'NONE', tasks: [] },
        { state: 'TODO', tasks: [] },
        { state: 'PROGRESS', tasks: [] },
        { state: 'REVIEW', tasks: [] },
        { state: 'DONE', tasks: [] }
    ];
    tasksSnapshot.forEach((doc) => {
        const task = doc.data();
        tasks.find(list => list.state === task.state).tasks.push(task);
    });
    return tasks;
}

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

async function importTask(db, task, project, author) {
    try {
        const order = highestOrder(db, project, task.state);
        const newDocRef = tasksCollection.doc();
        const taskData = {
            uid: newDocRef.id,
            author: task.author === '' ? author : task.author,
            project: project,
            title: task.title,
            description: task.description,
            assigned: task.assigned,
            state: task.state === '' ? 'NONE' : task.state,
            order: order,
            history: [{
                timestamp: new Date().getTime(),
                username: author,
                state: task.state === '' ? 'NONE' : task.state,
                previous: null
            }]
        };
        await tasksCollection.doc(newDocRef.id).set(taskData);
        return 'success';
    } catch (err) {
        return 'fail';
    }
}

async function updateTask(db, uid, taskData) {
    const tasksCollection = db.collection('tasks');
    const tasksSnapshot = await tasksCollection.where('uid', '==', uid).get();
    return tasksSnapshot.docs[0].ref.update(taskData);
}

module.exports = { 
    singleTask,
    getTaskList,
    highestOrder,
    createTask,
    importTask,
    updateTask
};