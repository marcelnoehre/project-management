import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from 'src/app/interfaces/state';
import { User } from 'src/app/interfaces/data/user';
import { Response } from 'src/app/interfaces/data/response';

@Injectable({
  providedIn: 'root'
})
export abstract class AdapterService {

  // ### AUTH ###
  public abstract login(username: string, password: string): Observable<User>;

  public abstract register(username: string, password: string, fullName: string, language: string): Observable<Response>;

  
  // ### PROJECT ###
  public abstract createProject(username: string, project: string): Observable<Response>;
  
  public abstract getTeamMembers(token: string, project: string): Observable<User[]>;

  public abstract inviteUser(username: string, project: string): Observable<User>;

  public abstract handleInvite(username: string, decision: boolean): Observable<Response>;

  public abstract removeUser(username: string): Observable<Response>;


  // ### TASKS ###
  public abstract getTaskList(): Observable<State[]>;

}
