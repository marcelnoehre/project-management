import { Injectable } from '@angular/core';
import { AdapterService } from './adapter.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interfaces/data/user';
import { SnackbarService } from '../snackbar.service';
import { State } from 'src/app/interfaces/state';
import { Response } from 'src/app/interfaces/data/response';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MockService extends AdapterService {
  private basePath = 'assets/mock-data/';
  private auth = 'auth/'

  constructor(
    private http: HttpClient,
    private snackbar: SnackbarService,
    private translate: TranslateService
  ) {
    super();
  }

  private availableMockData = {
		validUsers: ['admin'],
    register: ['mock'],
    projects: ['mock']
	};

  // ### AUTH ###
  public override login(username: string, password: string): Observable<User> {
    const hash = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'; //pw = 1234
    if (this.availableMockData.validUsers.includes(username) && password === hash) {
      const url = this.basePath + this.auth + `login/${username}.json`;
			return this.http.get<User>(url);
		} else {
      this.snackbar.open(this.translate.instant('ERROR.INVALID_CREDENTIALS'));
			throw new Error(this.translate.instant('ERROR.INVALID_CREDENTIALS'));
		}
  }

  public override register(username: string, password: string, fullName: string, language: string): Observable<Response> {
    if(this.availableMockData.register.includes(username)) {
      const url = this.basePath + this.auth + `register/${username}.json`;
      return this.http.get<Response>(url);
    } else {
      this.snackbar.open(this.translate.instant('ERROR.REGISTRATION'));
      throw new Error(this.translate.instant('ERROR.REGISTRATION'));
    }
  }

  public override createProject(username: string, project: string): Observable<Response> {
    if(this.availableMockData.projects.includes(project)) {
      const url = this.basePath + this.auth + `create-project/${project}.json`;
      return this.http.get<Response>(url);
    } else {
      this.snackbar.open(this.translate.instant('ERROR.CREATE_PROJECT'));
      throw new Error(this.translate.instant('ERROR.CREATE_PROJECT'));
    }
  }


  // ### TASKS ###
  public getTaskList(): Observable<State[]> {
    return this.http.get<State[]>('assets/mock-data/task/getTaskList/list.json');
  }
}