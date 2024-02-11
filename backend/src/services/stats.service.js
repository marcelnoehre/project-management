async function getTaskList(db, project) {
    const tasksCollection = db.collection('tasks');
    const tasksSnapshot = await tasksCollection
        .where('project', '==', project)
        .where('state', '!=', 'DELETED')
        .orderBy('state')
        .orderBy('order')
        .get();
    const tasks = {
        NONE: [],
        TODO: [],
        PROGRESS: [],
        REVIEW: [],
        DONE: []
    };
    tasksSnapshot.forEach((doc) => {
        tasks[doc.data().state].push(doc);
    });
    return tasks;
}

async function optimizeOrder(tasks) {
    const promises = [];
    Object.values(tasks).forEach(async (state) => {
        for (let i = 0; i < state.length; i++) {
            promises.push(state[i].ref.update({
                order: i + 1
            }));
        }
    });
    await Promise.all(promises);
}


module.exports = { 
    getTaskList,
    optimizeOrder
};