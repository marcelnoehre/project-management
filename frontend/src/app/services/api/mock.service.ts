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

@Injectable({
  providedIn: 'root'
})
export class MockService extends AdapterService {
  private basePath = 'assets/mock-data/';
  private auth = 'auth/';
  private project = 'project/';
  private task = 'task/';
  private notification = 'notifications/';
  private statsRoute = 'stats/';

  constructor(
    private http: HttpClient,
    private snackbar: SnackbarService,
    private translate: TranslateService
  ) {
    super();
  }

  private availableMockData = {
		user: ['owner', 'admin', 'invited', 'member'],
    invitable: ['user'],
    register: ['mock'],
    projects: ['mockProject']
	};

  // ### AUTH ###
  public override login(username: string, password: string): Observable<User> {
    const hash = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'; //pw = 1234
    if (this.availableMockData.user.includes(username) && password === hash) {
      const url = this.basePath + this.auth + `login/${username}.json`;
			return this.http.get<User>(url);
		} else {
      this.snackbar.open(this.translate.instant('ERROR.INVALID_CREDENTIALS'));
			throw new Error(this.translate.instant('ERROR.INVALID_CREDENTIALS'));
		}
  }

  public override register(username: string, fullName: string, language: string, password: string): Observable<Response> {
    if (this.availableMockData.register.includes(username)) {
      const url = this.basePath + this.auth + `register/${username}.json`;
      return this.http.get<Response>(url);
    } else {
      this.snackbar.open(this.translate.instant('ERROR.REGISTRATION'));
      throw new Error(this.translate.instant('ERROR.REGISTRATION'));
    }
  }

  public override verify(token: string): Observable<User> {
    // if (this.availableMockData.user.includes(username)) {
    //   const url = this.basePath + this.auth + `verify/${username}.json`;
    //   return this.http.get<User>(url);
    // } else {
    //   this.snackbar.open(this.translate.instant('ERROR.INVALID_TOKEN'));
    //   throw new Error(this.translate.instant('ERROR.INVALID_TOKEN'));
    // }
    throw new Error('Method not implemented!');
  }

  public override refreshToken(token: string): Observable<string> {
    throw new Error('Method not implemented!');
  }

  public override updateUser(token: string, attribute: string, value: string): Observable<Response> {
    const url = this.basePath + this.auth + 'updateUser/update.json';
    return this.http.get<Response>(url);
  }

  public override toggleNotifications(token: string, notificationsEnabled: boolean): Observable<Response> {
    const file = notificationsEnabled ? 'notificationsEnabled/true.json' : 'notificationsEnabled/false.json';
    const url = this.basePath + this.auth + file;
    return this.http.get<Response>(url);
  }

  public override deleteUser(token: string): Observable<Response> {
    const url = this.basePath + this.auth + 'deleteUser/delete.json';
    return this.http.get<Response>(url);
  }


  // ### PROJECT ###
  public override createProject(token: string, project: string): Observable<Response> {
    if (this.availableMockData.projects.includes(project)) {
      const url = this.basePath + this.project + `create-project/${project}.json`;
      return this.http.get<Response>(url);
    } else {
      this.snackbar.open(this.translate.instant('ERROR.CREATE_PROJECT'));
      throw new Error(this.translate.instant('ERROR.CREATE_PROJECT'));
    }
  }

  public override getTeamMembers(token: string): Observable<User[]> {
    const url = this.basePath + this.project + `get-team-members/mockProject.json`;
    return this.http.get<User[]>(url);
  }

  public override inviteUser(token: string, username: string): Observable<User> {
    if (this.availableMockData.invitable.includes(username)) {
      const url = this.basePath + this.project + `invite/${username}.json`;
      return this.http.get<User>(url);
    } else {
      this.snackbar.open(this.translate.instant('ERROR.NO_ACCOUNT'));
      throw new Error(this.translate.instant('ERROR.NO_ACCOUNT'));
    }
  }

  public override handleInvite(token: string, decision: boolean): Observable<Response> {
    const url = this.basePath + this.project + `handleInvite/${decision}.json`;
    return this.http.get<Response>(url);
  }

  public override updatePermission(token: string, username: string, permission: Permission): Observable<User[]> {
    // const url = this.basePath + this.project + `update-permission/${project}.json`;
    // return this.http.get<User[]>(url);
    throw new Error('Method not implemented!');
  }

  public override removeUser(token: string, username: string): Observable<Response> {
    const url = this.basePath + this.project + 'remove/user.json';
    return this.http.get<Response>(url);
  }

  public override leaveProject(token: string): Observable<Response> {
    const url = this.basePath + this.project + 'leave/success.json';
    return this.http.get<Response>(url);
  }


  // ### TASKS ###
  public override createTask(token: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
    const url = this.basePath + this.task + 'create-task/mockTask.json';
    return this.http.get<Response>(url);
  }

  public override importTasks(token: string, tasks: Task[]): Observable<Progress> {
    const url = this.basePath + this.task + 'import-tasks/progress.json';
    return this.http.get<Progress>(url);
  }

  public override getTaskList(token: string): Observable<State[]> {
    // const url = this.basePath + this.task + `get-task-list/${project}.json`;
    // return this.http.get<State[]>(url);
    throw new Error('Method not implemented!');
  }

  public override updateTask(token: string, task: Task): Observable<State[]> {
    const url = this.basePath + this.task + `update-task/${task.project}.json`;
    return this.http.get<State[]>(url);
  }

  public override updatePosition(token: string, uid: string, state: string, order: number): Observable<State[]> {
    const url = this.basePath + this.task + 'update-position/task.json';
    return this.http.get<State[]>(url);
  }

  public override moveToTrashBin(token: string, uid: string): Observable<State[]> {
    const url = this.basePath + this.task + 'move-to-trash-bin/moved.json';
    return this.http.get<State[]>(url);
  }
  
  public override getTrashBin(token: string): Observable<Task[]> {
    const url = this.basePath + this.task + 'get-trash-bin/trash-bin.json';  
    return this.http.get<Task[]>(url);
  }

  public override deleteTask(token: string, uid: string): Observable<Task[]> {
    const url = this.basePath + this.task + 'delete-task/delete.json';
    return this.http.get<Task[]>(url);
  }

  public override restoreTask(token: string, uid: string): Observable<Task[]> {
    const url = this.basePath + this.task + 'restore-task/restore.json';
    return this.http.get<Task[]>(url);
  }

  public override clearTrashBin(token: string): Observable<Response> {
    const url = this.basePath + this.task + 'clear-trash-bin/clear.json';
    return this.http.get<Response>(url);
  }

  // ### NOTIFICATIONS ###
  public override getNotifications(token: string): Observable<Notification[]> {
    const url = this.basePath + this.notification + 'get-notifications/notifications.json';
    return this.http.get<Notification[]>(url);
  }

  public override updateNotifications(token: string, seen: string[], removed: string[]): Observable<Notification[]> {
    const url = this.basePath + this.notification + 'update-notifications/success.json';
    return this.http.get<Notification[]>(url);
  }

  // ### STATS ###
  public override optimizeOrder(token: string): Observable<Response> {
    const url = this.basePath + this.statsRoute + 'optimize-order/success.json';
    return this.http.get<Response>(url);
  }

  public override personalStats(token: string): Observable<Stats> {
    const url = this.basePath + this.statsRoute + 'personal-stats/stats.json';
    return this.http.get<Stats>(url);
  }

  public override stats(token: string): Observable<AssignedStats[]> {
    const url = this.basePath + this.statsRoute + 'stats/stats.json';
    return this.http.get<AssignedStats[]>(url);
  }

  public override statLeaders(token: string): Observable<StatLeaders> {
    const url = this.basePath + this.statsRoute + 'stat-leaders/stats.json';
    return this.http.get<StatLeaders>(url);
  }

  public override taskAmount(token: string): Observable<CategoryStats> {
    const url = this.basePath + this.statsRoute + 'task-amount/stats.json';
    return this.http.get<CategoryStats>(url);
  }

  public override averageTime(token: string): Observable<CategoryStats> {
    const url = this.basePath + this.statsRoute + 'average-time/stats.json';
    return this.http.get<CategoryStats>(url);
  }

  public override wip(token: string): Observable<number> {
    const url = this.basePath + this.statsRoute + 'wip/stats.json';
    return this.http.get<number>(url);
  }

  public override taskProgress(token: string): Observable<any> {
    const url = this.basePath + this.statsRoute + 'taskProgress/stats.json';
    return this.http.get<any>(url);
  }

  public override projectRoadmap(token: string): Observable<any> {
    const url = this.basePath + this.statsRoute + 'projectRoadmap/stats.json';
    return this.http.get<any>(url);
  }

}