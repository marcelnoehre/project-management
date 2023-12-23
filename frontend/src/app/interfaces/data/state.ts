import { Task } from "./task";

export interface State {
    state: string,
    color: string,
    tasks: Task[]
}