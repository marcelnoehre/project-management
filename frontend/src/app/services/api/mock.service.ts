import { Injectable } from '@angular/core';
import { AdapterService } from './adapter.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interfaces/data/user';
import { SnackbarService } from '../snackbar.service';
import { Task } from 'src/app/interfaces/data/task';

@Injectable({
  providedIn: 'root'
})
export class MockService extends AdapterService {

  constructor(
    private http: HttpClient,
    private snackbar: SnackbarService
  ) {
    super();
  }

  private availableMockData = {
		validUsers: ['admin'],
	};

  // ### AUTH ###
  public override login(username: string, password: string): Observable<User> {
    if (this.availableMockData.validUsers.includes(username) && password === '1234') {
			return this.http.get<User>(`assets/mock-data/auth/login/${username}.json`);
		} else {
      this.snackbar.open('Wrong credentials!');
			throw new Error('Wrong credentials!');
		}
  }

  // ### TASKS ###
  public getTaskList(): Observable<Task[]> {
    return this.http.get<Task[]>('assets/mock-data/task/getTaskList/list.json');
  }
}