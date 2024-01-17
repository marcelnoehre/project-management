import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdapterService } from './adapter.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/interfaces/data/user';
import { State } from 'src/app/interfaces/data/state';
import { Response } from 'src/app/interfaces/data/response';

@Injectable({
  providedIn: 'root'
})
export class DbService extends AdapterService {
  private basePath = environment.apiBasePath;
  private auth = 'auth/';
  private project = 'project/';
  private task = 'task/';

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

  public override verify(token: string, username: string): Observable<User> {
    const body = {
      token: token,
      username: username,
    }
    return this.http.post<User>(this.basePath + this.auth + 'verify', body);
  }

  public override updateUser(token: string, username: string, attribute: string, value: string): Observable<Response> {
    const body = {
      token: token,
      username: username,
      attribute: attribute,
      value: value
    }
    return this.http.post<Response>(this.basePath + this.auth + 'updateUser', body);
  }

  public override deleteUser(token: string, username: string): Observable<Response> {
    const body = {
      token: token,
      username: username
    }
    return this.http.post<Response>(this.basePath + this.auth + 'deleteUser', body);
  }


  // ### PROJECT ###
  public override createProject(token: string, username: string, project: string): Observable<Response> {
    const body = {
      token: token,
      username: username,
      project: project
    };
    return this.http.post<Response>(this.basePath + this.project + 'create-project', body);
  }

  public override getTeamMembers(token: string, project: string): Observable<User[]> {
    const body = {
      token: token,
      project: project
    };
    return this.http.post<User[]>(this.basePath + this.project + 'get-team-members', body);
  }

  public override inviteUser(token: string, username: string, project: string): Observable<User> {
    const body = {
      token: token,
      username: username,
      project: project
    };
    return this.http.post<User>(this.basePath + this.project + 'invite', body);
  }

  public override handleInvite(token: string, username: string, decision: boolean): Observable<Response> {
    const body = {
      token: token,
      username: username,
      decision: decision
    };
    return this.http.post<Response>(this.basePath + this.project + 'handleInvite', body);
  }

  public override removeUser(token: string, username: string): Observable<Response> {
    const body = {
      token: token,
      username: username
    };
    return this.http.post<Response>(this.basePath + this.project + 'remove', body);
  }


  // ### TASKS ###
  public override createTask(token: string, author: string, project: string, title: string, description: string, state: string): Observable<Response> {
    const body = {
      token: token,
      author: author,
      project: project,
      title: title,
      description: description,
      state: state
    };
    return this.http.post<Response>(this.basePath + this.task + 'createTask', body);
  }
  
  public override getTaskList(token: string, project: string): Observable<State[]> {
    const body = {
      token: token,
      project: project
    };
    return this.http.post<State[]>(this.basePath + this.task + 'getTaskList', body);
  }

  public override updatePosition(token: string, project: string, uid: string, state: string, order: number): Observable<State[]> {
    const body = {
      token: token,
      project: project,
      uid: uid,
      state: state,
      order: order
    }
    return this.http.post<State[]>(this.basePath + this.task + 'updatePosition', body);
  }
  
}
