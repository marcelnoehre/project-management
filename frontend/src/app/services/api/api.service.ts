import { Injectable } from '@angular/core';
import { AdapterService } from './adapter.service';
import { DbService } from './db.service';
import { MockService } from './mock.service';
import { Adapter } from 'src/app/enums/adapter.enum';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/data/user';
import { State } from 'src/app/interfaces/data/state';
import { Response } from 'src/app/interfaces/data/response';
import { Task } from 'src/app/interfaces/data/task';
import { Progress } from 'src/app/interfaces/data/progress';
import { Notification } from 'src/app/interfaces/data/notification';
import { Permission } from 'src/app/enums/permission.enum';
import { AssignedStats } from 'src/app/interfaces/data/assigned-stats';
import { StatLeaders } from 'src/app/interfaces/data/stat-leaders';
import { CategoryStats } from 'src/app/interfaces/data/category-stats';
import { Stats } from 'src/app/interfaces/data/stats';
import { TaskProgress } from 'src/app/interfaces/data/task-progress';
import { ProjectRoadmap } from 'src/app/interfaces/data/project-roadmap';
import { TestService } from './test.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _adapter: AdapterService = this._db;
  private _chosenAdapter = environment.selectedApi;
  
  constructor(
    private _db: DbService,
    private _mock: MockService,
	private _test: TestService
  ) {
    this._resolveAdapter();
  }

	private _resolveAdapter() {
		switch (this._chosenAdapter) {
			case Adapter.DB:
				this._adapter = this._db;
				break;
			case Adapter.MOCK:
				this._adapter = this._mock;
				break;
			case Adapter.TEST:
				this._adapter = this._test;
				break;
			default:
				break;
		}
	}

	// ### AUTH ###
	public verify(token: string): Observable<User> {
		return this._adapter.verify(token);
	}

	public refreshToken(token: string): Observable<string> {
		return this._adapter.refreshToken(token);
	}

	public login(username: string, password: string): Observable<User> {
		return this._adapter.login(username, password);
	}

	public register(username: string, fullName: string, language: string, password: string): Observable<Response> {
		return this._adapter.register(username, fullName, language, password);
	}

	public updateUser(token: string, attribute: string, value: string): Observable<Response> {
		return this._adapter.updateUser(token, attribute, value);
	}

	public toggleNotifications(token: string, notificationsEnabled: boolean): Observable<Response> {
		return this._adapter.toggleNotifications(token, notificationsEnabled);
	}

	public deleteUser(token: string): Observable<Response> {
		return this._adapter.deleteUser(token);
	}


	// ### NOTIFICATIONS ###
	public getNotifications(token: string): Observable<Notification[]> {
		return this._adapter.getNotifications(token);
	}

	public updateNotifications(token: string, seen: string[], removed: string[]): Observable<Notification[]> {
		return this._adapter.updateNotifications(token, seen, removed);
	}


	// ### PROJECT ###
	public getTeamMembers(token: string): Observable<User[]> {
		return this._adapter.getTeamMembers(token);
	}

	public createProject(token: string, project: string): Observable<Response> {
		return this._adapter.createProject(token, project);
	}

	public inviteUser(token: string, username: string): Observable<User> {
		return this._adapter.inviteUser(token, username);
	}

	public handleInvite(token: string, decision: boolean): Observable<Response> {
		return this._adapter.handleInvite(token, decision);
	}

	public updatePermission(token: string, username: string, permission: Permission): Observable<User[]> {
		return this._adapter.updatePermission(token, username, permission);
	}

	public removeUser(token: string, username: string): Observable<Response> {
		return this._adapter.removeUser(token, username);
	}

	public leaveProject(token: string): Observable<Response> {
		return this._adapter.leaveProject(token);
	}


  	// ### STATS ###
	public personalStats(token: string): Observable<Stats> {
		return this._adapter.personalStats(token);
	}

	public stats(token: string): Observable<AssignedStats[]> {
		return this._adapter.stats(token);
	}

	public statLeaders(token: string): Observable<StatLeaders> {
		return this._adapter.statLeaders(token);
	}

	public taskAmount(token: string): Observable<CategoryStats> {
		return this._adapter.taskAmount(token);
	}

	public averageTime(token: string): Observable<CategoryStats> {
		return this._adapter.averageTime(token);
	}

	public wip(token: string): Observable<number> {
		return this._adapter.wip(token);
	}

	public taskProgress(token: string): Observable<TaskProgress> {
		return this._adapter.taskProgress(token);
	}

	public projectRoadmap(token: string): Observable<ProjectRoadmap[]> {
		return this._adapter.projectRoadmap(token);
	}

	public optimizeOrder(token: string): Observable<Response> {
		return this._adapter.optimizeOrder(token);
	}


	// ### TASKS ###
	public createTask(token: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
		return this._adapter.createTask(token, title, description, assigned, state);
	}

	public importTasks(token: string, tasks: Task[]): Observable<Progress> {
		return this._adapter.importTasks(token, tasks);
	}

	public getTaskList(token: string): Observable<State[]> {
		return this._adapter.getTaskList(token);
	}

	public updateTask(token: string, task: Task): Observable<State[]> {
		return this._adapter.updateTask(token, task);
	}

	public updatePosition(token: string, uid: string, state: string, order: number): Observable<State[]> {
		return this._adapter.updatePosition(token, uid, state, order);
	}

	public moveToTrashBin(token: string, uid: string): Observable<State[]> {
		return this._adapter.moveToTrashBin(token, uid);
	}
	
	public getTrashBin(token: string): Observable<Task[]> {
		return this._adapter.getTrashBin(token);
	}

	public deleteTask(token: string, uid: string): Observable<Task[]> {
		return this._adapter.deleteTask(token, uid);
	}

	public restoreTask(token: string, uid: string): Observable<Task[]> {
		return this._adapter.restoreTask(token, uid);
	}

	public clearTrashBin(token: string): Observable<Response> {
		return this._adapter.clearTrashBin(token);
	}
}
