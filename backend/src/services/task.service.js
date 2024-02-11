/**
 * Check if there is exactly 1 task with a specific uid.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} uid - The task uid.
 *
 * @returns {Object} The task data, if the uid is unique.
 */
async function singleTask(db, uid) {
    const tasksCollection = db.collection('tasks');
    const tasksSnapshot = await tasksCollection.where('uid', '==', uid).get();
    if (tasksSnapshot.size === 1) {
        return tasksSnapshot.docs[0].data();
    } else {
        return null;
    }
}

/**
 * Get the list of tasks subdivided by state.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 *
 * @returns {Object[]} The list of tasks.
 */
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

/**
 * Get the list of trashed tasks.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 *
 * @returns {Object[]} The list of trashed tasks.
 */
async function getTrashedList(db, project) {
    const tasksCollection = db.collection('tasks');
    const tasksSnapshot = await tasksCollection
        .where('project', '==', project)
        .where('state', '==', 'DELETED')
        .orderBy('state')
        .orderBy('order')
        .get();
    const tasks = [];
    tasksSnapshot.forEach((doc) => {
        tasks.push(doc.data());
    });
    return tasks;
}

/**
 * Get the new highest poition in the list of tasks by state.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} project - The project name.
 * @param {string} state - The task state.
 *
 * @returns {number} The calculated position.
 */
async function highestOrder(db, project, state) {
    const tasksCollection = db.collection('tasks');
    const tasksSnapshot = await tasksCollection
        .where('project', '==', project)
        .where('state', '==', state)
        .orderBy('order', 'desc').limit(1).get();
    return tasksSnapshot.empty ? 1 : (Math.ceil(tasksSnapshot.docs[0].data().order) + 1);
}

/**
 * Create a task.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} author - The task author.
 * @param {string} project - The project name.
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {string} assigned - The assigned team member.
 * @param {string} state - The task state.
 * @param {string} order - The position in the list of tasks.
 *
 * @returns {Promise} Promise of the creation.
 */
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

/**
 * Import a task.
 *
 * @param {Object} db - Firestore instance.
 * @param {Object} task - The imported task object.
 * @param {string} project - The project name.
 * @param {string} author - The task author.
 *
 * @returns {Promise} Promise of the import.
 */
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

/**
 * Update a task.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} uid - The task uid.
 * @param {Object} taskData - The task data that should get updated
 *
 * @returns {Promise} Promise of the update.
 */
async function updateTask(db, uid, taskData) {
    const tasksCollection = db.collection('tasks');
    const tasksSnapshot = await tasksCollection.where('uid', '==', uid).get();
    return tasksSnapshot.docs[0].ref.update(taskData);
}

/**
 * Delete a task.
 *
 * @param {Object} db - Firestore instance.
 * @param {string} uid - The task uid.
 *
 * @returns {Promise} Promise of the deletion.
 */
async function deleteTask(db, uid) {
    const tasksCollection = db.collection('tasks');
    const tasksSnapshot = await tasksCollection.where('uid', '==', uid).get();
    return tasksSnapshot.docs[0].ref.delete();
}

module.exports = { 
    singleTask,
    getTaskList,
    getTrashedList,
    highestOrder,
    createTask,
    importTask,
    updateTask,
    deleteTask
};