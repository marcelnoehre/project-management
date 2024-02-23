import { Injectable } from '@angular/core';
import { AdapterService } from './adapter.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interfaces/data/user';
import { SnackbarService } from '../snackbar.service';
import { State } from 'src/app/interfaces/data/state';
import { Response } from 'src/app/interfaces/data/response';
import { TranslateService } from '@ngx-translate/core';
import { Task } from 'src/app/interfaces/data/task';
import { Progress } from 'src/app/interfaces/data/progress';
import { Notification } from 'src/app/interfaces/data/notification';
import { Permission } from 'src/app/enums/permission.enum';
import { AssignedStats } from 'src/app/interfaces/data/assigned-stats';
import { StatLeaders } from 'src/app/interfaces/data/stat-leaders';
import { CategoryStats } from 'src/app/interfaces/data/category-stats';
import { Stats } from 'src/app/interfaces/data/stats';
import { RequestPath } from 'src/app/enums/request-path.enum';
import { TaskProgress } from 'src/app/interfaces/data/task-progress';
import { ProjectRoadmap } from 'src/app/interfaces/data/project-roadmap';

@Injectable({
	providedIn: 'root'
})
export class MockService extends AdapterService {

	constructor(
		private _http: HttpClient,
		private _snackbar: SnackbarService,
		private _translate: TranslateService
	) {
		super();
	}

	private _availableMockData = {
		user: ['owner', 'admin', 'member', 'invited', 'none'],
		register: ['mock'],
		invitable: ['invitedAnother'],
		projects: ['mockProject']
	};

	private buildURL(endpoint: string, file = 'mock') {
		return `assets/mock-data/${endpoint}/${file}.json`;
	}

	// ### AUTH ###
	public override verify(token: string): Observable<User> {
		if (this._availableMockData.user.includes(token)) {
			this._logRequest('verify', ['token', token]);
			return this._http.get<User>(this.buildURL(RequestPath.VERIFY, token));
		} else {
			this._snackbar.open(this._translate.instant('ERROR.INVALID_TOKEN'));
			throw new Error(this._translate.instant('ERROR.INVALID_TOKEN'));
		}
	}

	public override refreshToken(token: string): Observable<string> {
		if (this._availableMockData.user.includes(token)) {
			this._logRequest('refreshToken', ['token', token]);
			return this._http.get<string>(this.buildURL(RequestPath.REFRESH_TOKEN, token));
		} else {
			this._snackbar.open(this._translate.instant('ERROR.INTERNAL'));
			throw new Error(this._translate.instant('ERROR.INTERNAL'));
		}
	}

	public override login(username: string, password: string): Observable<User> {
		const hash = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'; //pw = 1234
		if (this._availableMockData.user.includes(username) && password === hash) {
			this._logRequest('login', ['username', username], ['password', password]);
			return this._http.get<User>(this.buildURL(RequestPath.LOGIN, username));
		} else {
			this._snackbar.open(this._translate.instant('ERROR.INVALID_CREDENTIALS'));
			throw new Error(this._translate.instant('ERROR.INVALID_CREDENTIALS'));
		}
	}

	public override register(username: string, fullName: string, language: string, password: string): Observable<Response> {
		if (this._availableMockData.register.includes(username)) {
			this._logRequest('register', ['username', username], ['fullName', fullName], ['language', language], ['password', password]);
			return this._http.get<Response>(this.buildURL(RequestPath.REGISTER, username));
		} else {
			this._snackbar.open(this._translate.instant('ERROR.REGISTRATION'));
			throw new Error(this._translate.instant('ERROR.REGISTRATION'));
		}
	}

	public override updateUser(token: string, attribute: string, value: string): Observable<Response> {
		this._logRequest('updateUser', ['token', token], ['attribute', attribute], ['value', value]);
		return this._http.get<Response>(this.buildURL(RequestPath.UPDATE_USER));
	}

	public override toggleNotifications(token: string, notificationsEnabled: boolean): Observable<Response> {
		const fileName = notificationsEnabled ? 'enabled' : 'disabled';
		this._logRequest('toggleNotifications', ['token', token], ['notificationsEnabled', notificationsEnabled]);
		return this._http.get<Response>(this.buildURL(RequestPath.TOGGLE_NOTIFICATIONS, fileName));
	}

	public override deleteUser(token: string): Observable<Response> {
		this._logRequest('deleteUser', ['token', token]);
		return this._http.get<Response>(this.buildURL(RequestPath.DELETE_USER, 'delete'));
	}


	// ### NOTIFICATIONS ###
	public override getNotifications(token: string): Observable<Notification[]> {
		this._logRequest('getNotifications', ['token', token]);
		return this._http.get<Notification[]>(this.buildURL(RequestPath.GET_NOTIFICATIONS));
	}
  
	public override updateNotifications(token: string, seen: string[], removed: string[]): Observable<Notification[]> {
		this._logRequest('updateNotifications', ['token', token], ['seen', seen], ['removed', removed]);
		return this._http.get<Notification[]>(this.buildURL(RequestPath.UPDATE_NOTIFICATIONS));
	}


	// ### PROJECT ###
	public override getTeamMembers(token: string): Observable<User[]> {
		this._logRequest('getTeamMembers', ['token', token]);
		return this._http.get<User[]>(this.buildURL(RequestPath.GET_TEAM_MEMBERS));
	}

	public override createProject(token: string, project: string): Observable<Response> {
		this._logRequest('createProject', ['token', token], ['project', project]);
		return this._http.get<Response>(this.buildURL(RequestPath.CREATE_PROJECT));
	}

	public override inviteUser(token: string, username: string): Observable<User> {
		if (this._availableMockData.invitable.includes(username)) {
			this._logRequest('inviteUser', ['token', token], ['username', username]);
			return this._http.get<User>(this.buildURL(RequestPath.INVITE, username));
		} else {
			this._snackbar.open(this._translate.instant('ERROR.NO_ACCOUNT'));
			throw new Error(this._translate.instant('ERROR.NO_ACCOUNT'));
		}
	}

	public override handleInvite(token: string, decision: boolean): Observable<Response> {
		const fileName = decision ? 'accepted' : 'rejected';
		this._logRequest('handleInvite', ['token', token], ['decision', decision]);
		return this._http.get<Response>(this.buildURL(RequestPath.HANDLE_INVITE, fileName));
	}

	public override updatePermission(token: string, username: string, permission: Permission): Observable<User[]> {
		this._logRequest('updatePermission', ['token', token], ['username', username], ['permission', permission]);
		return this._http.get<User[]>(this.buildURL(RequestPath.UPDATE_PERMISSION));
	}

	public override removeUser(token: string, username: string): Observable<Response> {
		this._logRequest('removeUser', ['token', token], ['username', username]);
		return this._http.get<Response>(this.buildURL(RequestPath.REMOVE));
	}

	public override leaveProject(token: string): Observable<Response> {
		this._logRequest('leaveProject', ['token', token]);
		return this._http.get<Response>(this.buildURL(RequestPath.LEAVE));
	}


	// ### STATS ###
	public override personalStats(token: string): Observable<Stats> {
		this._logRequest('personalStats', ['token', token]);
		return this._http.get<Stats>(this.buildURL(RequestPath.PERSONAL_STATS));
	}

	public override stats(token: string): Observable<AssignedStats[]> {
		this._logRequest('stats', ['token', token]);
		return this._http.get<AssignedStats[]>(this.buildURL(RequestPath.STATS));
	}

	public override statLeaders(token: string): Observable<StatLeaders> {
		this._logRequest('statLeaders', ['token', token]);
		return this._http.get<StatLeaders>(this.buildURL(RequestPath.STAT_LEADERS));
	}

	public override taskAmount(token: string): Observable<CategoryStats> {
		this._logRequest('taskAmount', ['token', token]);
		return this._http.get<CategoryStats>(this.buildURL(RequestPath.TASK_AMOUNT));
	}

	public override averageTime(token: string): Observable<CategoryStats> {
		this._logRequest('averageTime', ['token', token]);
		return this._http.get<CategoryStats>(this.buildURL(RequestPath.AVERAGE_TIME));
	}

	public override wip(token: string): Observable<number> {
		this._logRequest('wip', ['token', token]);
		return this._http.get<number>(this.buildURL(RequestPath.WIP));
	}

	public override taskProgress(token: string): Observable<TaskProgress> {
		this._logRequest('taskProgress', ['token', token]);
		return this._http.get<TaskProgress>(this.buildURL(RequestPath.TASK_PROGRESS));
	}

	public override projectRoadmap(token: string): Observable<ProjectRoadmap[]> {
		this._logRequest('projectRoadmap', ['token', token]);
		return this._http.get<ProjectRoadmap[]>(this.buildURL(RequestPath.PROJECT_ROADMAP));
	}

	public override optimizeOrder(token: string): Observable<Response> {
		this._logRequest('optimizeOrder', ['token', token]);
		return this._http.get<Response>(this.buildURL(RequestPath.OPTIMIZE_ORDER));
	}


	// ### TASK ###
	public override createTask(token: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
		this._logRequest('createTask', ['token', token], ['title', title], ['description', description], ['assigned', assigned], ['state', state]);
		return this._http.get<Response>(this.buildURL(RequestPath.CREATE_TASK));
	}

	public override importTasks(token: string, tasks: Task[]): Observable<Progress> {
		this._logRequest('importTasks', ['token', token], ['tasks', tasks]);
		return this._http.get<Progress>(this.buildURL(RequestPath.IMPORT_TASKS));
	}

	public override getTaskList(token: string): Observable<State[]> {
		this._logRequest('getTaskList', ['token', token]);
		return this._http.get<State[]>(this.buildURL(RequestPath.GET_TASK_LIST));
	}

	public override updateTask(token: string, task: Task): Observable<State[]> {
		this._logRequest('updateTask', ['token', token], ['task', task]);
		return this._http.get<State[]>(this.buildURL(RequestPath.UPDATE_TASK));
	}

	public override updatePosition(token: string, uid: string, state: string, order: number): Observable<State[]> {
		this._logRequest('updatePosition', ['token', token], ['uid', uid], ['state', state], ['order', order]);
		return this._http.get<State[]>(this.buildURL(RequestPath.UPDATE_POSITION));
	}

	public override moveToTrashBin(token: string, uid: string): Observable<State[]> {
		this._logRequest('moveToTrashBin', ['token', token], ['uid', uid]);
		return this._http.get<State[]>(this.buildURL(RequestPath.MOVE_TO_TRASH_BIN));
	}
  
	public override getTrashBin(token: string): Observable<Task[]> {
		this._logRequest('getTrashBin', ['token', token]);
		return this._http.get<Task[]>(this.buildURL(RequestPath.GET_TRASH_BIN));
	}

	public override deleteTask(token: string, uid: string): Observable<Task[]> {
		this._logRequest('deleteTask', ['token', token], ['uid', uid]);
		return this._http.get<Task[]>(this.buildURL(RequestPath.DELETE_TASK));
	}

	public override restoreTask(token: string, uid: string): Observable<Task[]> {
		this._logRequest('restoreTask', ['token', token], ['uid', uid]);
		return this._http.get<Task[]>(this.buildURL(RequestPath.RESTORE_TASK));
	}

	public override clearTrashBin(token: string): Observable<Response> {
		this._logRequest('clearTrashBin', ['token', token]);
		return this._http.get<Response>(this.buildURL(RequestPath.CLEAR_TRASH_BIN));
	}

	private _logRequest(request: string, ...data: [string, any][]): void {
		const obj: { [key: string]: any } = {};
		data.forEach(([key, value]) => {
			obj[key] = value;
		});
		console.log('##### ' + request.toUpperCase() + ' #####'); // eslint-disable-line no-console
		console.dir(obj); // eslint-disable-line no-console
	}
}