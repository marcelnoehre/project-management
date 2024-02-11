import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from 'src/app/interfaces/data/state';
import { User } from 'src/app/interfaces/data/user';
import { Response } from 'src/app/interfaces/data/response';
import { Task } from 'src/app/interfaces/data/task';
import { Progress } from 'src/app/interfaces/data/progress';
import { Notification } from 'src/app/interfaces/data/notification';
import { Permission } from 'src/app/enums/permission.enum';
import { AssignedStats } from 'src/app/interfaces/data/assigned-stats';
import { StatLeaders } from 'src/app/interfaces/data/stat-leaders';
import { CategoryStats } from 'src/app/interfaces/data/category-stats';
import { Stats } from 'src/app/interfaces/data/stats';

@Injectable({
  providedIn: 'root'
})
export abstract class AdapterService {

  // ### AUTH ###
  public abstract login(username: string, password: string): Observable<User>;

  public abstract register(username: string, fullName: string, language: string, password: string): Observable<Response>;

  public abstract verify(token: string): Observable<User>;

  public abstract updateToken(token: string): Observable<string>;

  public abstract updateUser(token: string, attribute: string, value: string): Observable<Response>;

  public abstract toggleNotifications(token: string, notificationsEnabled: boolean): Observable<Response>;

  public abstract deleteUser(token: string): Observable<Response>;

  
  // ### PROJECT ###
  public abstract createProject(token: string, project: string): Observable<Response>;
  
  public abstract getTeamMembers(token: string): Observable<User[]>;

  public abstract inviteUser(token: string, username: string): Observable<User>;

  public abstract handleInvite(token: string, decision: boolean): Observable<Response>;

  public abstract updatePermission(token: string, username: string, permission: Permission): Observable<User[]>;

  public abstract removeUser(token: string, username: string): Observable<Response>;

  public abstract leaveProject(token: string): Observable<Response>;


  // ### TASKS ###
  public abstract createTask(token: string, title: string, description: string, assigned: string, state: string): Observable<Response>;

  public abstract importTasks(token: string, tasks: Task[]): Observable<Progress>;
  
  public abstract getTaskList(token: string): Observable<State[]>;

  public abstract updateTask(token: string, task: Task): Observable<State[]>;

  public abstract updatePosition(token: string, uid: string, state: string, order: number): Observable<State[]>;

  public abstract moveToTrashBin(token: string, uid: string): Observable<State[]>;

  public abstract getTrashBin(token: string): Observable<Task[]>;

  public abstract deleteTask(token: string, uid: string): Observable<Task[]>;

  public abstract restoreTask(token: string, uid: string): Observable<Task[]>;

  public abstract clearTrashBin(token: string): Observable<Response>;

  // ### NOTIFICATIONS ###
  public abstract getNotifications(token: string): Observable<Notification[]>;

  public abstract updateNotifications(token: string, seen: string[], removed: string[]): Observable<Notification[]>;


  // ### STATS ###
  public abstract optimizeOrder(token: string): Observable<Response>;

  public abstract personalStats(token: string): Observable<Stats>;

  public abstract stats(token: string): Observable<AssignedStats[]>;

  public abstract statLeaders(token: string): Observable<StatLeaders>;

  public abstract taskAmount(token: string): Observable<CategoryStats>;

  public abstract averageTime(token: string): Observable<CategoryStats>;

  public abstract wip(token: string): Observable<number>;
  
  // TODO: refactor the response
  public abstract taskProgress(token: string): Observable<any>;

  public abstract projectRoadmap(token: string): Observable<any>;

}
