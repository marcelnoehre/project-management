import { TaskState } from 'src/app/enums/task-state.enum';
import { TaskHistory } from './task-history';

export interface Task {
	uid: string,
	author: string,
	project: string,
	title: string,
	description: string,
	assigned: string,
	state: TaskState,
	order: number,
	history: TaskHistory[]
}