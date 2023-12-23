import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdapterService } from './adapter.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/interfaces/data/user';
import { State } from 'src/app/interfaces/data/state';

@Injectable({
  providedIn: 'root'
})
export class DbService extends AdapterService {
  private basePath = environment.apiBasePath;
  private auth = 'auth/'

  constructor(private http: HttpClient) {
    super();
  }

  // ### AUTH ###
  public login(username: string, password: string): Observable<User> {
		return this.http.post<any>(this.basePath + this.auth + 'login', {username: username, password: password});
	}

  // ### TASKS ###
  public getTaskList(): Observable<State[]> {
    throw new Error('Method not implemented!');
  }

}
