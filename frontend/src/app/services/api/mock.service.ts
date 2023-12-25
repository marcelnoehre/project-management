import { Injectable } from '@angular/core';
import { AdapterService } from './adapter.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interfaces/data/user';
import { SnackbarService } from '../snackbar.service';
import { State } from 'src/app/interfaces/state';

@Injectable({
  providedIn: 'root'
})
export class MockService extends AdapterService {
  private basePath = 'assets/mock-data/';
  private auth = 'auth/'

  constructor(
    private http: HttpClient,
    private snackbar: SnackbarService
  ) {
    super();
  }

  private availableMockData = {
		validUsers: ['admin'],
    register: ['mock']
	};

  // ### AUTH ###
  public override login(username: string, password: string): Observable<User> {
    if (this.availableMockData.validUsers.includes(username) && password === '1234') {
      const url = this.basePath + this.auth + `login/${username}.json`;
			return this.http.get<User>(url);
		} else {
      this.snackbar.open('Wrong credentials!');
			throw new Error('Wrong credentials!');
		}
  }

  public override register(username: string, password: string, name: string, lang: string): Observable<Response> {
    if(this.availableMockData.register.includes(username)) {
      const url = this.basePath + this.auth + `register/${username}`;
      return this.http.get<Response>(url);
    } else {
      this.snackbar.open('Registration failed!');
      throw new Error('Registration failed!');
    }
  }


  // ### TASKS ###
  public getTaskList(): Observable<State[]> {
    return this.http.get<State[]>('assets/mock-data/task/getTaskList/list.json');
  }
}