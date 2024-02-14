import { Injectable } from '@angular/core';
import { Stats } from 'mocha';
import { Observable } from 'rxjs';
import { Permission } from 'src/app/enums/permission.enum';
import { AssignedStats } from 'src/app/interfaces/data/assigned-stats';
import { CategoryStats } from 'src/app/interfaces/data/category-stats';
import { Progress } from 'src/app/interfaces/data/progress';
import { ProjectRoadmap } from 'src/app/interfaces/data/project-roadmap';
import { StatLeaders } from 'src/app/interfaces/data/stat-leaders';
import { State } from 'src/app/interfaces/data/state';
import { Task } from 'src/app/interfaces/data/task';
import { TaskProgress } from 'src/app/interfaces/data/task-progress';
import { User } from 'src/app/interfaces/data/user';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor() { }

	// ### AUTH ###
	public verify(token: string): Observable<User> {
    throw Error('Method not implemented!');
	}

	public refreshToken(token: string): Observable<string> {
    throw Error('Method not implemented!');
	}

	public login(username: string, password: string): Observable<User> {
    throw Error('Method not implemented!');
	}

	public register(username: string, fullName: string, language: string, password: string): Observable<Response> {
    throw Error('Method not implemented!');
	}

	public updateUser(token: string, attribute: string, value: string): Observable<Response> {
    throw Error('Method not implemented!');
	}

	public toggleNotifications(token: string, notificationsEnabled: boolean): Observable<Response> {
    throw Error('Method not implemented!');
	}

	public deleteUser(token: string): Observable<Response> {
    throw Error('Method not implemented!');
	}


	// ### NOTIFICATIONS ###
	public getNotifications(token: string): Observable<Notification[]> {
    throw Error('Method not implemented!');
	}

	public updateNotifications(token: string, seen: string[], removed: string[]): Observable<Notification[]> {
    throw Error('Method not implemented!');
	}


	// ### PROJECT ###
	public getTeamMembers(token: string): Observable<User[]> {
    throw Error('Method not implemented!');
	}

	public createProject(token: string, project: string): Observable<Response> {
    throw Error('Method not implemented!');
	}

	public inviteUser(token: string, username: string): Observable<User> {
    throw Error('Method not implemented!');
	}

	public handleInvite(token: string, decision: boolean): Observable<Response> {
    throw Error('Method not implemented!');
	}

	public updatePermission(token: string, username: string, permission: Permission): Observable<User[]> {
    throw Error('Method not implemented!');
	}

	public removeUser(token: string, username: string): Observable<Response> {
    throw Error('Method not implemented!');
	}

	public leaveProject(token: string): Observable<Response> {
    throw Error('Method not implemented!');
	}


  	// ### STATS ###
	public personalStats(token: string): Observable<Stats> {
    throw Error('Method not implemented!');
	}

	public stats(token: string): Observable<AssignedStats[]> {
    throw Error('Method not implemented!');
	}

	public statLeaders(token: string): Observable<StatLeaders> {
    throw Error('Method not implemented!');
	}

	public taskAmount(token: string): Observable<CategoryStats> {
    throw Error('Method not implemented!');
	}

	public averageTime(token: string): Observable<CategoryStats> {
    throw Error('Method not implemented!');
	}

	public wip(token: string): Observable<number> {
    throw Error('Method not implemented!');
	}

	public taskProgress(token: string): Observable<TaskProgress> {
    throw Error('Method not implemented!');
	}

	public projectRoadmap(token: string): Observable<ProjectRoadmap[]> {
    throw Error('Method not implemented!');
	}

	public optimizeOrder(token: string): Observable<Response> {
    throw Error('Method not implemented!');
	}


	// ### TASKS ###
	public createTask(token: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
    throw Error('Method not implemented!');
	}

	public importTasks(token: string, tasks: Task[]): Observable<Progress> {
    throw Error('Method not implemented!');
	}

	public getTaskList(token: string): Observable<State[]> {
    throw Error('Method not implemented!');
	}

	public updateTask(token: string, task: Task): Observable<State[]> {
    throw Error('Method not implemented!');
	}

	public updatePosition(token: string, uid: string, state: string, order: number): Observable<State[]> {
    throw Error('Method not implemented!');
	}

	public moveToTrashBin(token: string, uid: string): Observable<State[]> {
    throw Error('Method not implemented!');
	}
	
	public getTrashBin(token: string): Observable<Task[]> {
    throw Error('Method not implemented!');
	}

	public deleteTask(token: string, uid: string): Observable<Task[]> {
    throw Error('Method not implemented!');
	}

	public restoreTask(token: string, uid: string): Observable<Task[]> {
    throw Error('Method not implemented!');
	}

	public clearTrashBin(token: string): Observable<Response> {
    throw Error('Method not implemented!');
	}
}
