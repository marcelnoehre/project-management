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

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private adapter!: AdapterService;
  private chosenAdapter = environment.selectedApi;
  
  constructor(
    private db: DbService,
    private mock: MockService
  ) {
    this.resolveAdapter();
  }

	private resolveAdapter() {
		switch (this.chosenAdapter) {
			case Adapter.db:
				this.adapter = this.db;
				break;
			case Adapter.mock:
				this.adapter = this.mock;
				break;
			default:
				console.error('No adapter!');
				break;
		}
	}

	// ### AUTH ###
	public login(username: string, password: string): Observable<User> {
		return this.adapter.login(username, password);
	}

	public register(username: string, fullName: string, language: string, password: string): Observable<Response> {
		return this.adapter.register(username, password, fullName, language);
	}

	public verify(token: string): Observable<User> {
		return this.adapter.verify(token);
	}

	public updateUser(token: string, attribute: string, value: string): Observable<Response> {
		return this.adapter.updateUser(token, attribute, value);
	}

	public toggleNotifications(token: string, notificationsEnabled: boolean): Observable<Response> {
		return this.adapter.toggleNotifications(token, notificationsEnabled);
	}

	public deleteUser(token: string): Observable<Response> {
		return this.adapter.deleteUser(token);
	}


	// ### PROJECT ###
	public createProject(token: string, project: string): Observable<Response> {
		return this.adapter.createProject(token, project);
	}
	
	public getTeamMembers(token: string): Observable<User[]> {
		return this.adapter.getTeamMembers(token);
	}

	public inviteUser(token: string, username: string): Observable<User> {
		return this.adapter.inviteUser(token, username);
	}

	public handleInvite(token: string, decision: boolean): Observable<Response> {
		return this.adapter.handleInvite(token, decision);
	}

	public updatePermission(token: string, username: string, permission: Permission): Observable<User[]> {
		return this.adapter.updatePermission(token, username, permission);
	}

	public removeUser(token: string, username: string): Observable<Response> {
		return this.adapter.removeUser(token, username);
	}

	public leaveProject(token: string): Observable<Response> {
		return this.adapter.leaveProject(token);
	}


	// ### TASKS ###
	public createTask(token: string, author: string, project: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
		return this.adapter.createTask(token, author, project, title, description, assigned, state);
	}

	public importTasks(token: string, author: string, project: string, tasks: Task[]): Observable<Progress> {
		return this.adapter.importTasks(token, author, project, tasks);
	}

	public getTaskList(token: string, project: string): Observable<State[]> {
		return this.adapter.getTaskList(token, project);
	}

	public updateTask(token: string, task: Task): Observable<State[]> {
		return this.adapter.updateTask(token, task);
	}

	public updatePosition(token: string, project: string, uid: string, state: string, order: number): Observable<State[]> {
		return this.adapter.updatePosition(token, project, uid, state, order);
	}

	public moveToTrashBin(token: string, project: string, uid: string): Observable<State[]> {
		return this.adapter.moveToTrashBin(token, project, uid);
	}
	
	public getTrashBin(token: string, project: string): Observable<Task[]> {
		return this.adapter.getTrashBin(token, project);
	}

	public deleteTask(token: string, project: string, uid: string): Observable<Task[]> {
		return this.adapter.deleteTask(token, project, uid);
	}

	public restoreTask(token: string, project: string, uid: string): Observable<Task[]> {
		return this.adapter.restoreTask(token, project, uid);
	}

	public clearTrashBin(token: string, project: string): Observable<Response> {
		return this.adapter.clearTrashBin(token, project);
	}

	// ### NOTIFICATIONS ###
	public getNotifications(token: string, project: string, username: string): Observable<Notification[]> {
		return this.adapter.getNotifications(token, project, username);
	}

	public updateNotifications(token: string, username: string, project: string, seen: string[], removed: string[]): Observable<Notification[]> {
		return this.adapter.updateNotifications(token, username, project, seen, removed);
	}


  	// ### STATS ###
  	public optimizeOrder(token: string): Observable<Response> {
		return this.adapter.optimizeOrder(token);
	}

	public personalStats(token: string): Observable<Stats> {
		return this.adapter.personalStats(token);
	}

	public stats(token: string): Observable<AssignedStats[]> {
		return this.adapter.stats(token);
	}

	public statLeaders(token: string): Observable<StatLeaders> {
		return this.adapter.statLeaders(token);
	}

	public taskAmount(token: string): Observable<CategoryStats> {
		return this.adapter.taskAmount(token);
	}

	public averageTime(token: string): Observable<CategoryStats> {
		return this.adapter.averageTime(token);
	}

	public wip(token: string): Observable<number> {
		return this.adapter.wip(token);
	}

	public taskProgress(token: string): Observable<any> {
		return this.adapter.taskProgress(token);
	}

	public projectRoadmap(token: string): Observable<any> {
		return this.adapter.projectRoadmap(token);
	}

}
