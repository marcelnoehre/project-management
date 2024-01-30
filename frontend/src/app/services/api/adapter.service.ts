import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from 'src/app/interfaces/data/state';
import { User } from 'src/app/interfaces/data/user';
import { Response } from 'src/app/interfaces/data/response';
import { Task } from 'src/app/interfaces/data/task';
import { Progress } from 'src/app/interfaces/data/progress';
import { Notification } from 'src/app/interfaces/data/notification';
import { Permission } from 'src/app/enums/permission.enum';

@Injectable({
  providedIn: 'root'
})
export abstract class AdapterService {

  // ### AUTH ###
  public abstract login(username: string, password: string): Observable<User>;

  public abstract register(username: string, password: string, fullName: string, language: string): Observable<Response>;

  public abstract verify(token: string, username: string): Observable<User>;

  public abstract updateUser(token: string, username: string, attribute: string, value: string): Observable<Response>;

  public abstract toggleNotifications(token: string, username: string, notificationsEnabled: boolean): Observable<Response>;

  public abstract deleteUser(token: string, username: string): Observable<Response>;

  
  // ### PROJECT ###
  public abstract createProject(token: string, username: string, project: string): Observable<Response>;
  
  public abstract getTeamMembers(token: string, project: string): Observable<User[]>;

  public abstract inviteUser(token: string, username: string, project: string): Observable<User>;

  public abstract handleInvite(token: string, username: string, decision: boolean): Observable<Response>;

  public abstract updatePermission(token: string, username: string, project: string, permission: Permission): Observable<User[]>;

  public abstract removeUser(token: string, username: string): Observable<Response>;

  public abstract leaveProject(token: string, username: string): Observable<Response>;


  // ### TASKS ###
  public abstract createTask(token: string, author: string, project: string, title: string, description: string, assigned: string, state: string): Observable<Response>;

  public abstract importTasks(token: string, author: string, project: string, tasks: Task[]): Observable<Progress>;
  
  public abstract getTaskList(token: string, project: string): Observable<State[]>;

  public abstract updateTask(token: string, task: Task): Observable<State[]>;

  public abstract updatePosition(token: string, project: string, uid: string, state: string, order: number): Observable<State[]>;

  public abstract moveToTrashBin(token: string, project: string, uid: string): Observable<State[]>;

  public abstract getTrashBin(token: string, project: string): Observable<Task[]>;

  public abstract deleteTask(token: string, project: string, uid: string): Observable<Task[]>;

  public abstract restoreTask(token: string, project: string, uid: string): Observable<Task[]>;

  public abstract clearTrashBin(token: string, project: string): Observable<Response>;

  // ### NOTIFICATIONS ###
  public abstract getNotifications(token: string, project: string, username: string): Observable<Notification[]>;

  public abstract updateNotifications(token: string, username: string, project: string, seen: string[], removed: string[]): Observable<Notification[]>;

}
