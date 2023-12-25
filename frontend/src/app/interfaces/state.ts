import { Task } from "./data/task";

export interface State {
    state: string,
    color: string,
    tasks: Task[]
}