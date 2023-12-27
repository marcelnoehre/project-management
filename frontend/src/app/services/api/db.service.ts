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
  private auth = 'auth/';
  private project = 'project/';

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


  // ### PROJECT ###
  public override createProject(username: string, project: string): Observable<Response> {
    const body = {
      username: username,
      project: project
    };
    return this.http.post<Response>(this.basePath + this.project + 'create-project', body);
  }

  public override getTeamMembers(project: string): Observable<User[]> {
    return this.http.get<User[]>(this.basePath + this.project + 'get-team-members' + `?project=${project}`);
  }

  public override inviteUser(username: string, project: string): Observable<User> {
    const body = {
      username: username,
      project: project
    };
    return this.http.post<User>(this.basePath + this.project + 'invite', body);
  }

  public override handleInvite(username: string, decision: boolean): Observable<Response> {
    const body = {
      username: username,
      decision: decision
    };
    return this.http.post<Response>(this.basePath + this.project + 'handleInvite', body);
  }

  public override removeUser(username: string): Observable<Response> {
    const body = {
      username: username
    };
    return this.http.post<Response>(this.basePath + this.project + 'remove', body);
  }


  // ### TASKS ###
  public getTaskList(): Observable<State[]> {
    throw new Error('Method not implemented!');
  }

}
