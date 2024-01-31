import { TaskState } from "src/app/enums/task-state.enum";

export interface TaskHistory {
    timestamp: number,
    username: string,
    state: TaskState,
    type: string
}