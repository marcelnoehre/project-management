const auth = 'auth/';
const notifications = 'notifications/';
const project = 'project/';
const stats = 'stats/';
const task = 'task/';

export enum RequestPath {
    // AUTH
    VERIFY = auth + 'verify',
    REFRESH_TOKEN = auth + 'refresh-token',
    LOGIN = auth + 'login',
    REGISTER = auth + 'register',
    UPDATE_USER = auth + 'update-user',
    TOGGLE_NOTIFICATIONS = auth + 'toggle-notifications',
    DELETE_USER = auth + 'delete-user',

    // NOTIFICATIONS
    GET_NOTIFICATIONS = notifications + 'get-notifications',
    UPDATE_NOTIFICATIONS = notifications + 'update-notifications',

    // PROJECT
    GET_TEAM_MEMBERS = project + 'get-team-members',
    CREATE_PROJECT = project + 'create-project',
    INVITE = project + 'invite',
    HANDLE_INVITE = project + 'handle-invite',
    UPDATE_PERMISSION = project + 'update-permission',
    REMOVE = project + 'remove',
    LEAVE = project + 'leave',

    // STATS
    PERSONAL_STATS = stats + 'personal-stats',
    STATS = stats + 'stats',
    STAT_LEADERS = stats + 'stat-leaders',
    TASK_AMOUNT = stats + 'task-amount',
    AVERAGE_TIME = stats + 'average-time',
    WIP = stats + 'wip',
    TASK_PROGRESS = stats + 'task-progress',
    PROJECT_ROADMAP = stats + 'project-roadmap',
    OPTIMIZE_ORDER = stats + 'optimize-order',

    // TASK
    GET_TASK_LIST = task + 'get-task-list',
    GET_TRASH_BIN = task + 'get-trash-bin',
    CREATE_TASK = task + 'create-task',
    IMPORT_TASKS = task + 'import-tasks',
    UPDATE_TASK = task + 'update-task',
    UPDATE_POSITION = task + 'update-position',
    MOVE_TO_TRASH_BIN = task + 'move-to-trash-bin',
    RESTORE_TASK = task + 'restore-task',
    DELETE_TASK = task + 'delete-task',
    CLEAR_TRASH_BIN = task + 'clear-trash-bin'
}