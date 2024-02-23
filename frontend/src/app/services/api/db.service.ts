import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdapterService } from './adapter.service';
import { environment } from 'src/environments/environment';
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
import { RequestService } from '../request.service';
import { RequestType } from 'src/app/enums/request-type.enum';
import { RequestPath } from 'src/app/enums/request-path.enum';
import { TaskProgress } from 'src/app/interfaces/data/task-progress';
import { ProjectRoadmap } from 'src/app/interfaces/data/project-roadmap';

@Injectable({
	providedIn: 'root'
})
export class DbService extends AdapterService {
	private _basePath = environment.apiBasePath;

	constructor(
	  private request: RequestService
	) {
		super();
	}

	// ### AUTH ###
	public override verify(token: string): Observable<User> {
		const query = {
			token: token
		};
		return this.request.send<User>(RequestType.GET, this._basePath + RequestPath.VERIFY, query);
	}

	public override refreshToken(token: string): Observable<string> {
		const query = {
			token: token
		};
		return this.request.send<string>(RequestType.GET, this._basePath + RequestPath.REFRESH_TOKEN, query);
	}

	public override login(username: string, password: string): Observable<User> {
		const body = {
			username: username,
			password: password
		};
		return this.request.send<User>(RequestType.POST, this._basePath + RequestPath.LOGIN, body);
	}

	public override register(username: string, fullName: string, language: string, password: string): Observable<Response> {
		const body = {
			username: username,
			fullName: fullName,
			language: language,
			password: password
		};
		return this.request.send<Response>(RequestType.POST, this._basePath + RequestPath.REGISTER, body);
	}

	public override updateUser(token: string, attribute: string, value: string): Observable<Response> {
		const body = {
			token: token,
			attribute: attribute,
			value: value
		};
		return this.request.send<Response>(RequestType.PUT, this._basePath + RequestPath.UPDATE_USER, body);
	}

	public override toggleNotifications(token: string, notificationsEnabled: boolean): Observable<Response> {
		const body = {
			token: token,
			notificationsEnabled: notificationsEnabled
		};
		return this.request.send<Response>(RequestType.PUT, this._basePath + RequestPath.TOGGLE_NOTIFICATIONS, body);
	}

	public override deleteUser(token: string): Observable<Response> {
		const query = {
			token: token
		};
		return this.request.send<Response>(RequestType.DELETE, this._basePath + RequestPath.DELETE_USER, query);
	}


	// ### NOTIFICATIONS ###
	public override getNotifications(token: string): Observable<Notification[]> {
		const query = {
			token: token
		};
		return this.request.send<Notification[]>(RequestType.GET, this._basePath + RequestPath.GET_NOTIFICATIONS, query);
	}
  
	public override updateNotifications(token: string, seen: string[], removed: string[]): Observable<Notification[]> {
		const body = {
			token: token,
			seen: seen,
			removed: removed
		};
		return this.request.send<Notification[]>(RequestType.PUT, this._basePath + RequestPath.UPDATE_NOTIFICATIONS, body);
	}


	// ### PROJECT ###
	public override getTeamMembers(token: string): Observable<User[]> {
		const query = {
			token: token
		};
		return this.request.send<User[]>(RequestType.GET, this._basePath + RequestPath.GET_TEAM_MEMBERS, query);
	}

	public override createProject(token: string, project: string): Observable<Response> {
		const body = {
			token: token,
			project: project
		};
		return this.request.send<Response>(RequestType.POST, this._basePath + RequestPath.CREATE_PROJECT, body);
	}

	public override inviteUser(token: string, username: string): Observable<User> {
		const body = {
			token: token,
			username: username
		};
		return this.request.send<User>(RequestType.PUT, this._basePath + RequestPath.INVITE, body);
	}

	public override handleInvite(token: string, decision: boolean): Observable<Response> {
		const body = {
			token: token,
			decision: decision
		};
		return this.request.send<Response>(RequestType.PUT, this._basePath + RequestPath.HANDLE_INVITE, body);
	}

	public override updatePermission(token: string, username: string, permission: Permission): Observable<User[]> {
		const body = {
			token: token,
			username: username,
			permission: permission
		};
		return this.request.send<User[]>(RequestType.PUT, this._basePath + RequestPath.UPDATE_PERMISSION, body);
	}

	public override removeUser(token: string, username: string): Observable<Response> {
		const body = {
			token: token,
			username: username
		};
		return this.request.send<Response>(RequestType.PUT, this._basePath + RequestPath.REMOVE, body);
	}

	public override leaveProject(token: string): Observable<Response> {
		const body = {
			token: token
		};
		return this.request.send<Response>(RequestType.PUT, this._basePath + RequestPath.LEAVE, body);
	}


	// ### STATS ###
	public override personalStats(token: string): Observable<Stats> {
		const query = {
			token: token
		};
		return this.request.send<Stats>(RequestType.GET, this._basePath + RequestPath.PERSONAL_STATS, query);
	}

	public override stats(token: string): Observable<AssignedStats[]> {
		const query = {
			token: token
		};
		return this.request.send<AssignedStats[]>(RequestType.GET, this._basePath + RequestPath.STATS, query);
	}

	public override statLeaders(token: string): Observable<StatLeaders> {
		const query = {
			token: token
		};
		return this.request.send<StatLeaders>(RequestType.GET, this._basePath + RequestPath.STAT_LEADERS, query);
	}

	public override taskAmount(token: string): Observable<CategoryStats> {
		const query = {
			token: token
		};
		return this.request.send<CategoryStats>(RequestType.GET, this._basePath + RequestPath.TASK_AMOUNT, query);
	}

	public override averageTime(token: string): Observable<CategoryStats> {
		const query = {
			token: token
		};
		return this.request.send<CategoryStats>(RequestType.GET, this._basePath + RequestPath.AVERAGE_TIME, query);
	}

	public override wip(token: string): Observable<number> {
		const query = {
			token: token
		};
		return this.request.send<number>(RequestType.GET, this._basePath + RequestPath.WIP, query);
	}

	public override taskProgress(token: string): Observable<TaskProgress> {
		const query = {
			token: token
		};
		return this.request.send<TaskProgress>(RequestType.GET, this._basePath + RequestPath.TASK_PROGRESS, query);
	}

	public override projectRoadmap(token: string): Observable<ProjectRoadmap[]> {
		const query = {
			token: token
		};
		return this.request.send<ProjectRoadmap[]>(RequestType.GET, this._basePath + RequestPath.PROJECT_ROADMAP, query);
	}

	public override optimizeOrder(token: string): Observable<Response> {
		const body = {
			token: token
		};
		return this.request.send<Response>(RequestType.PUT, this._basePath + RequestPath.OPTIMIZE_ORDER, body);
	}


	// ### TASKS ###
	public override createTask(token: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
		const body = {
			token: token,
			title: title,
			description: description,
			assigned: assigned,
			state: state
		};
		return this.request.send<Response>(RequestType.POST, this._basePath + RequestPath.CREATE_TASK, body);
	}
  
	public override importTasks(token: string, tasks: Task[]): Observable<Progress> {
		const body = {
			token: token,
			tasks: tasks
		};
		return this.request.send<Progress>(RequestType.POST, this._basePath + RequestPath.IMPORT_TASKS, body);
	}
  
	public override getTaskList(token: string): Observable<State[]> {
		const query = {
			token: token
		};
		return this.request.send<State[]>(RequestType.GET, this._basePath + RequestPath.GET_TASK_LIST, query);
	}

	public override updateTask(token: string, task: Task): Observable<State[]> {
		const body = {
			token: token,
			task: task
		};
		return this.request.send<State[]>(RequestType.PUT, this._basePath + RequestPath.UPDATE_TASK, body);
	}

	public override updatePosition(token: string, uid: string, state: string, order: number): Observable<State[]> {
		const body = {
			token: token,
			uid: uid,
			state: state,
			order: order
		};
		return this.request.send<State[]>(RequestType.PUT, this._basePath + RequestPath.UPDATE_POSITION, body);
	}

	public override moveToTrashBin(token: string, uid: string): Observable<State[]> {
		const body = {
			token: token,
			uid: uid
		};
		return this.request.send<State[]>(RequestType.PUT, this._basePath + RequestPath.MOVE_TO_TRASH_BIN, body);
	}

	public override getTrashBin(token: string): Observable<Task[]> {
		const query = {
			token: token
		};
		return this.request.send<Task[]>(RequestType.GET, this._basePath + RequestPath.GET_TRASH_BIN, query);
	}

	public override deleteTask(token: string, uid: string): Observable<Task[]> {
		const query = {
			token: token,
			uid: uid
		};
		return this.request.send<Task[]>(RequestType.DELETE, this._basePath + RequestPath.DELETE_TASK, query);
	}
  
	public override restoreTask(token: string, uid: string): Observable<Task[]> {
		const body = {
			token: token,
			uid: uid
		};
		return this.request.send<Task[]>(RequestType.PUT, this._basePath + RequestPath.RESTORE_TASK, body);
	}

	public override clearTrashBin(token: string): Observable<Response> {
		const query = {
			token: token
		};
		return this.request.send<Response>(RequestType.DELETE, this._basePath + RequestPath.CLEAR_TRASH_BIN, query);
	}
}
