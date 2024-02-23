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
		user: ['owner', 'admin', 'invited', 'member'],
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
      return this._http.get<User>(this.buildURL(RequestPath.VERIFY, token));
    } else {
      this._snackbar.open(this._translate.instant('ERROR.INVALID_TOKEN'));
      throw new Error(this._translate.instant('ERROR.INVALID_TOKEN'));
    }
  }

  public override refreshToken(token: string): Observable<string> {
    if (this._availableMockData.user.includes(token)) {
      return this._http.get<string>(this.buildURL(RequestPath.REFRESH_TOKEN, token));
    } else {
      this._snackbar.open(this._translate.instant('ERROR.INTERNAL'));
      throw new Error(this._translate.instant('ERROR.INTERNAL'));
    }
  }

  public override login(username: string, password: string): Observable<User> {
    const hash = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'; //pw = 1234
    if (this._availableMockData.user.includes(username) && password === hash) {
			return this._http.get<User>(this.buildURL(RequestPath.LOGIN, username));
		} else {
      this._snackbar.open(this._translate.instant('ERROR.INVALID_CREDENTIALS'));
			throw new Error(this._translate.instant('ERROR.INVALID_CREDENTIALS'));
		}
  }

  public override register(username: string, fullName: string, language: string, password: string): Observable<Response> {
    if (this._availableMockData.register.includes(username)) {
      return this._http.get<Response>(this.buildURL(RequestPath.REGISTER, username));
    } else {
      this._snackbar.open(this._translate.instant('ERROR.REGISTRATION'));
      throw new Error(this._translate.instant('ERROR.REGISTRATION'));
    }
  }

  public override updateUser(token: string, attribute: string, value: string): Observable<Response> {
    return this._http.get<Response>(this.buildURL(RequestPath.UPDATE_USER));
  }

  public override toggleNotifications(token: string, notificationsEnabled: boolean): Observable<Response> {
    const fileName = notificationsEnabled ? 'enabled' : 'disabled';
    return this._http.get<Response>(this.buildURL(RequestPath.TOGGLE_NOTIFICATIONS, fileName));
  }

  public override deleteUser(token: string): Observable<Response> {
    return this._http.get<Response>(this.buildURL(RequestPath.DELETE_USER, 'delete'));
  }


  // ### NOTIFICATIONS ###
  public override getNotifications(token: string): Observable<Notification[]> {
    return this._http.get<Notification[]>(this.buildURL(RequestPath.GET_NOTIFICATIONS));
  }
  
  public override updateNotifications(token: string, seen: string[], removed: string[]): Observable<Notification[]> {
    return this._http.get<Notification[]>(this.buildURL(RequestPath.UPDATE_NOTIFICATIONS));
  }


  // ### PROJECT ###
  public override getTeamMembers(token: string): Observable<User[]> {
    return this._http.get<User[]>(this.buildURL(RequestPath.GET_TEAM_MEMBERS));
  }

  public override createProject(token: string, project: string): Observable<Response> {
    return this._http.get<Response>(this.buildURL(RequestPath.CREATE_PROJECT));
  }

  public override inviteUser(token: string, username: string): Observable<User> {
    if (this._availableMockData.invitable.includes(username)) {
      return this._http.get<User>(this.buildURL(RequestPath.INVITE, username));
    } else {
      this._snackbar.open(this._translate.instant('ERROR.NO_ACCOUNT'));
      throw new Error(this._translate.instant('ERROR.NO_ACCOUNT'));
    }
  }

  public override handleInvite(token: string, decision: boolean): Observable<Response> {
    const fileName = decision ? 'accepted' : 'rejected';
    return this._http.get<Response>(this.buildURL(RequestPath.HANDLE_INVITE, fileName));
  }

  public override updatePermission(token: string, username: string, permission: Permission): Observable<User[]> {
    return this._http.get<User[]>(this.buildURL(RequestPath.UPDATE_PERMISSION));
  }

  public override removeUser(token: string, username: string): Observable<Response> {
    return this._http.get<Response>(this.buildURL(RequestPath.REMOVE));
  }

  public override leaveProject(token: string): Observable<Response> {
    return this._http.get<Response>(this.buildURL(RequestPath.LEAVE));
  }


  // ### STATS ###
  public override personalStats(token: string): Observable<Stats> {
    return this._http.get<Stats>(this.buildURL(RequestPath.PERSONAL_STATS));
  }

  public override stats(token: string): Observable<AssignedStats[]> {
    return this._http.get<AssignedStats[]>(this.buildURL(RequestPath.STATS));
  }

  public override statLeaders(token: string): Observable<StatLeaders> {
    return this._http.get<StatLeaders>(this.buildURL(RequestPath.STAT_LEADERS));
  }

  public override taskAmount(token: string): Observable<CategoryStats> {
    return this._http.get<CategoryStats>(this.buildURL(RequestPath.TASK_AMOUNT));
  }

  public override averageTime(token: string): Observable<CategoryStats> {
    return this._http.get<CategoryStats>(this.buildURL(RequestPath.AVERAGE_TIME));
  }

  public override wip(token: string): Observable<number> {
    return this._http.get<number>(this.buildURL(RequestPath.WIP));
  }

  public override taskProgress(token: string): Observable<TaskProgress> {
    return this._http.get<TaskProgress>(this.buildURL(RequestPath.TASK_PROGRESS));
  }

  public override projectRoadmap(token: string): Observable<ProjectRoadmap[]> {
    return this._http.get<ProjectRoadmap[]>(this.buildURL(RequestPath.PROJECT_ROADMAP));
  }

  public override optimizeOrder(token: string): Observable<Response> {
    return this._http.get<Response>(this.buildURL(RequestPath.OPTIMIZE_ORDER));
  }


  // ### TASK ###
  public override createTask(token: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
    return this._http.get<Response>(this.buildURL(RequestPath.CREATE_TASK));
  }

  public override importTasks(token: string, tasks: Task[]): Observable<Progress> {
    return this._http.get<Progress>(this.buildURL(RequestPath.IMPORT_TASKS));
  }

  public override getTaskList(token: string): Observable<State[]> {
    return this._http.get<State[]>(this.buildURL(RequestPath.GET_TASK_LIST));
  }

  public override updateTask(token: string, task: Task): Observable<State[]> {
    return this._http.get<State[]>(this.buildURL(RequestPath.UPDATE_TASK));
  }

  public override updatePosition(token: string, uid: string, state: string, order: number): Observable<State[]> {
    return this._http.get<State[]>(this.buildURL(RequestPath.UPDATE_POSITION));
  }

  public override moveToTrashBin(token: string, uid: string): Observable<State[]> {
    return this._http.get<State[]>(this.buildURL(RequestPath.MOVE_TO_TRASH_BIN));
  }
  
  public override getTrashBin(token: string): Observable<Task[]> {
    return this._http.get<Task[]>(this.buildURL(RequestPath.GET_TRASH_BIN));
  }

  public override deleteTask(token: string, uid: string): Observable<Task[]> {
    return this._http.get<Task[]>(this.buildURL(RequestPath.DELETE_TASK));
  }

  public override restoreTask(token: string, uid: string): Observable<Task[]> {
    return this._http.get<Task[]>(this.buildURL(RequestPath.RESTORE_TASK));
  }

  public override clearTrashBin(token: string): Observable<Response> {
    return this._http.get<Response>(this.buildURL(RequestPath.CLEAR_TRASH_BIN));
  }
}