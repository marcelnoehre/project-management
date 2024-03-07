import { TaskState } from '../enums/task-state.enum';

export interface Export {
	title: string, 
	description: string,
	author: string,
	assigned: string,
	state: TaskState,
	order: number
}