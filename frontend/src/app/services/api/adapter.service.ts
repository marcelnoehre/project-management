import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from 'src/app/interfaces/data/state';
import { User } from 'src/app/interfaces/data/user';
import { Response } from 'src/app/interfaces/data/response';

@Injectable({
  providedIn: 'root'
})
export abstract class AdapterService {

  // ### AUTH ###
  public abstract login(username: string, password: string): Observable<User>;

  public abstract register(username: string, password: string, fullName: string, language: string): Observable<Response>;

  public abstract verify(token: string, username: string): Observable<User>;

  public abstract updateUser(token: string, username: string, attribute: string, value: string): Observable<Response>;

  public abstract deleteUser(token: string, username: string): Observable<Response>;

  
  // ### PROJECT ###
  public abstract createProject(token: string, username: string, project: string): Observable<Response>;
  
  public abstract getTeamMembers(token: string, project: string): Observable<User[]>;

  public abstract inviteUser(token: string, username: string, project: string): Observable<User>;

  public abstract handleInvite(token: string, username: string, decision: boolean): Observable<Response>;

  public abstract removeUser(token: string, username: string): Observable<Response>;


  // ### TASKS ###
  public abstract createTask(token: string, author: string, project: string, title: string, description: string, state: string): Observable<Response>;
  
  public abstract getTaskList(token: string, project: string): Observable<State[]>;

  public abstract updatePosition(token: string, project: string, uid: string, state: string, order: number): Observable<State[]>;

}
