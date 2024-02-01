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

  public override register(username: string, password: string, fullName: string, language: string): Observable<Response> {
    if (this.availableMockData.register.includes(username)) {
      const url = this.basePath + this.auth + `register/${username}.json`;
      return this.http.get<Response>(url);
    } else {
      this.snackbar.open(this.translate.instant('ERROR.REGISTRATION'));
      throw new Error(this.translate.instant('ERROR.REGISTRATION'));
    }
  }

  public override verify(token: string, username: string): Observable<User> {
    if (this.availableMockData.user.includes(username)) {
      const url = this.basePath + this.auth + `verify/${username}.json`;
      return this.http.get<User>(url);
    } else {
      this.snackbar.open(this.translate.instant('ERROR.INVALID_TOKEN'));
      throw new Error(this.translate.instant('ERROR.INVALID_TOKEN'));
    }
  }

  public override updateUser(token: string, username: string, attribute: string, value: string): Observable<Response> {
    const url = this.basePath + this.auth + 'updateUser/update.json';
    return this.http.get<Response>(url);
  }

  public override toggleNotifications(token: string, username: string, notificationsEnabled: boolean): Observable<Response> {
    const file = notificationsEnabled ? 'notificationsEnabled/true.json' : 'notificationsEnabled/false.json';
    const url = this.basePath + this.auth + file;
    return this.http.get<Response>(url);
  }

  public override deleteUser(token: string, username: string): Observable<Response> {
    const url = this.basePath + this.auth + 'deleteUser/delete.json';
    return this.http.get<Response>(url);
  }


  // ### PROJECT ###
  public override createProject(token: string, username: string, project: string): Observable<Response> {
    if (this.availableMockData.projects.includes(project)) {
      const url = this.basePath + this.project + `create-project/${project}.json`;
      return this.http.get<Response>(url);
    } else {
      this.snackbar.open(this.translate.instant('ERROR.CREATE_PROJECT'));
      throw new Error(this.translate.instant('ERROR.CREATE_PROJECT'));
    }
  }

  public override getTeamMembers(token: string, project: string): Observable<User[]> {
    if (this.availableMockData.projects.includes(project)) {
      const url = this.basePath + this.project + `get-team-members/${project}.json`;
      return this.http.get<User[]>(url);
    } else {
      this.snackbar.open(this.translate.instant('ERROR.INTERNAL'));
      throw new Error(this.translate.instant('ERROR.INTERNAL'));
    }
  }

  public override inviteUser(token: string, username: string, project: string): Observable<User> {
    if (this.availableMockData.invitable.includes(username)) {
      const url = this.basePath + this.project + `invite/${username}.json`;
      return this.http.get<User>(url);
    } else {
      this.snackbar.open(this.translate.instant('ERROR.NO_ACCOUNT'));
      throw new Error(this.translate.instant('ERROR.NO_ACCOUNT'));
    }
  }

  public override handleInvite(token: string, username: string, decision: boolean): Observable<Response> {
    const url = this.basePath + this.project + `handleInvite/${decision}.json`;
    return this.http.get<Response>(url);
  }

  public override updatePermission(token: string, username: string, project: string, permission: Permission): Observable<User[]> {
    const url = this.basePath + this.project + `update-permission/${project}.json`;
    return this.http.get<User[]>(url);
  }

  public override removeUser(token: string, username: string): Observable<Response> {
    const url = this.basePath + this.project + 'remove/user.json';
    return this.http.get<Response>(url);
  }

  public override leaveProject(token: string, username: string): Observable<Response> {
    const url = this.basePath + this.project + 'leave/success.json';
    return this.http.get<Response>(url);
  }


  // ### TASKS ###
  public override createTask(token: string, author: string, project: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
    const url = this.basePath + this.task + 'create-task/mockTask.json';
    return this.http.get<Response>(url);
  }

  public override importTasks(token: string, author: string, project: string, tasks: Task[]): Observable<Progress> {
    const url = this.basePath + this.task + 'import-tasks/progress.json';
    return this.http.get<Progress>(url);
  }

  public override getTaskList(token: string, project: string): Observable<State[]> {
    const url = this.basePath + this.task + `get-task-list/${project}.json`;
    return this.http.get<State[]>(url);
  }

  public override updateTask(token: string, task: Task): Observable<State[]> {
    const url = this.basePath + this.task + `update-task/${task.project}.json`;
    return this.http.get<State[]>(url);
  }

  public override updatePosition(token: string, project: string, uid: string, state: string, order: number): Observable<State[]> {
    const url = this.basePath + this.task + 'update-position/task.json';
    return this.http.get<State[]>(url);
  }

  public override moveToTrashBin(token: string, project: string, uid: string): Observable<State[]> {
    const url = this.basePath + this.task + 'move-to-trash-bin/moved.json';
    return this.http.get<State[]>(url);
  }
  
  public override getTrashBin(token: string, project: string): Observable<Task[]> {
    const url = this.basePath + this.task + 'get-trash-bin/trash-bin.json';  
    return this.http.get<Task[]>(url);
  }

  public override deleteTask(token: string, project: string, uid: string): Observable<Task[]> {
    const url = this.basePath + this.task + 'delete-task/delete.json';
    return this.http.get<Task[]>(url);
  }

  public override restoreTask(token: string, project: string, uid: string): Observable<Task[]> {
    const url = this.basePath + this.task + 'restore-task/restore.json';
    return this.http.get<Task[]>(url);
  }

  public override clearTrashBin(token: string, project: string): Observable<Response> {
    const url = this.basePath + this.task + 'clear-trash-bin/clear.json';
    return this.http.get<Response>(url);
  }

  // ### NOTIFICATIONS ###
  public override getNotifications(token: string, project: string, username: string): Observable<Notification[]> {
    const url = this.basePath + this.notification + 'get-notifications/notifications.json';
    return this.http.get<Notification[]>(url);
  }

  public override updateNotifications(token: string, username: string, project: string, seen: string[], removed: string[]): Observable<Notification[]> {
    const url = this.basePath + this.notification + 'update-notifications/success.json';
    return this.http.get<Notification[]>(url);
  }

  // ### STATS ###
  public override optimizeOrder(token: string): Observable<Response> {
    const url = this.basePath + this.statsRoute + 'optimize-order/success.json';
    return this.http.get<Response>(url);
  }

  public override stats(token: string): Observable<AssignedStats[]> {
    const url = this.basePath + this.statsRoute + 'stats/stats.json';
    return this.http.get<AssignedStats[]>(url);
  }

}