import { Injectable } from '@angular/core';
import { AdapterService } from './adapter.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interfaces/data/user';
import { SnackbarService } from '../snackbar.service';
import { State } from 'src/app/interfaces/data/state';
import { Response } from 'src/app/interfaces/data/response';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MockService extends AdapterService {
  private basePath = 'assets/mock-data/';
  private auth = 'auth/';
  private project = 'project/';
  private task = 'task/';

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

  public override removeUser(token: string, username: string): Observable<Response> {
    const url = this.basePath + this.project + 'remove/user.json';
    return this.http.get<Response>(url);
  }


  // ### TASKS ###
  public override createTask(token: string, author: string, project: string, title: string, description: string, state: string): Observable<Response> {
    const url = this.basePath + this.task + 'create-task/mockTask.json';
    return this.http.get<Response>(url);
  }

  public override getTaskList(token: string, project: string): Observable<State[]> {
    const url = this.basePath + this.task + 'get-task-list/list.json';
    return this.http.get<State[]>(url);
  }

  public override updatePosition(token: string, project: string, uid: string, state: string, order: number): Observable<State[]> {
    const url = this.basePath + this.task + 'update-position/task.json';
    return this.http.get<State[]>(url);
  }
  
}