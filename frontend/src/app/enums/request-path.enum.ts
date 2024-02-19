const _auth = 'auth/';
const _notifications = 'notifications/';
const _project = 'project/';
const _stats = 'stats/';
const _task = 'task/';

export enum RequestPath {
    // ### AUTH ###
    VERIFY = _auth + 'verify',
    REFRESH_TOKEN = _auth + 'refresh-token',
    LOGIN = _auth + 'login',
    REGISTER = _auth + 'register',
    UPDATE_USER = _auth + 'update-user',
    TOGGLE_NOTIFICATIONS = _auth + 'toggle-notifications',
    DELETE_USER = _auth + 'delete-user',

    // ### NOTIFICATIONS ###
    GET_NOTIFICATIONS = _notifications + 'get-notifications',
    UPDATE_NOTIFICATIONS = _notifications + 'update-notifications',

    // ### PROJECT ###
    GET_TEAM_MEMBERS = _project + 'get-team-members',
    CREATE_PROJECT = _project + 'create-project',
    INVITE = _project + 'invite',
    HANDLE_INVITE = _project + 'handle-invite',
    UPDATE_PERMISSION = _project + 'update-permission',
    REMOVE = _project + 'remove',
    LEAVE = _project + 'leave',

    // ### STATS ###
    PERSONAL_STATS = _stats + 'personal-stats',
    STATS = _stats + 'stats',
    STAT_LEADERS = _stats + 'stat-leaders',
    TASK_AMOUNT = _stats + 'task-amount',
    AVERAGE_TIME = _stats + 'average-time',
    WIP = _stats + 'wip',
    TASK_PROGRESS = _stats + 'task-progress',
    PROJECT_ROADMAP = _stats + 'project-roadmap',
    OPTIMIZE_ORDER = _stats + 'optimize-order',

    // ### TASK ###
    GET_TASK_LIST = _task + 'get-task-list',
    GET_TRASH_BIN = _task + 'get-trash-bin',
    CREATE_TASK = _task + 'create-task',
    IMPORT_TASKS = _task + 'import-tasks',
    UPDATE_TASK = _task + 'update-task',
    UPDATE_POSITION = _task + 'update-position',
    MOVE_TO_TRASH_BIN = _task + 'move-to-trash-bin',
    RESTORE_TASK = _task + 'restore-task',
    DELETE_TASK = _task + 'delete-task',
    CLEAR_TRASH_BIN = _task + 'clear-trash-bin'
}