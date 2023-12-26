import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdapterService } from './adapter.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/interfaces/data/user';
import { State } from 'src/app/interfaces/state';
import { Response } from 'src/app/interfaces/data/response';

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
  public override login(username: string, password: string): Observable<User> {
    const body = {
      username: username,
      password: password
    };
		return this.http.post<User>(this.basePath + this.auth + 'login', body);
	}

  public override register(username: string, password: string, fullName: string, language: string): Observable<Response> {
    const body = {
      username: username,
      password: password,
      fullName: fullName,
      language: language
    };
    return this.http.post<Response>(this.basePath + this.auth + 'register', body);
  }

  public override createProject(username: string, project: string): Observable<Response> {
    const body = {
      username: username,
      project: project
    };
    return this.http.post<Response>(this.basePath + this.auth + 'create-project', body);
  }

  // ### PROJECT ###
  public override getTeamMembers(project: string): Observable<User[]> {
    throw new Error('Method not implemented!');
  }


  // ### TASKS ###
  public getTaskList(): Observable<State[]> {
    throw new Error('Method not implemented!');
  }

}
