import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdapterService } from './adapter.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/interfaces/data/user';
import { State } from 'src/app/interfaces/data/state';
import { Response } from 'src/app/interfaces/data/response';
import { Task } from 'src/app/interfaces/data/task';
import { Progress } from 'src/app/interfaces/data/progress';
import { Notification } from 'src/app/interfaces/data/notification';
import { Permission } from 'src/app/enums/permission.enum';
import { AssignedStats } from 'src/app/interfaces/data/assigned-stats';
import { StatLeaders } from 'src/app/interfaces/data/stat-leaders';
import { CategoryStats } from 'src/app/interfaces/data/category-stats';

@Injectable({
  providedIn: 'root'
})
export class DbService extends AdapterService {
  private basePath = environment.apiBasePath;
  private auth = 'auth/';
  private project = 'project/';
  private task = 'task/';
  private notification = 'notifications/';
  private statsRoute = 'stats/';

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

  public override toggleNotifications(token: string, username: string, notificationsEnabled: boolean): Observable<Response> {
    const body = {
      token: token,
      username: username,
      notificationsEnabled: notificationsEnabled
    }
    return this.http.post<Response>(this.basePath + this.auth + 'toggleNotifications', body);
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

  public override updatePermission(token: string, username: string, project: string, permission: Permission): Observable<User[]> {
    const body = {
      token: token,
      username: username,
      project: project,
      permission: permission
    }
    return this.http.post<User[]>(this.basePath + this.project + 'updatePermission', body);
  }

  public override removeUser(token: string, username: string): Observable<Response> {
    const body = {
      token: token,
      username: username
    };
    return this.http.post<Response>(this.basePath + this.project + 'remove', body);
  }

  public override leaveProject(token: string, username: string): Observable<Response> {
    const body = {
      token: token,
      username: username
    };
    return this.http.post<Response>(this.basePath + this.project + 'leave', body);
  }


  // ### TASKS ###
  public override createTask(token: string, author: string, project: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
    const body = {
      token: token,
      author: author,
      project: project,
      title: title,
      description: description,
      assigned: assigned,
      state: state
    };
    return this.http.post<Response>(this.basePath + this.task + 'createTask', body);
  }
  
  public override importTasks(token: string, author: string, project: string, tasks: Task[]): Observable<Progress> {
    const body = {
      token: token,
      author: author,
      project: project,
      tasks: tasks
    }
    return this.http.post<Progress>(this.basePath + this.task + 'importTasks', body);
  }
  
  public override getTaskList(token: string, project: string): Observable<State[]> {
    const body = {
      token: token,
      project: project
    };
    return this.http.post<State[]>(this.basePath + this.task + 'getTaskList', body);
  }

  public override updateTask(token: string, task: Task): Observable<State[]> {
    const body = {
      token: token,
      task: task
    }
    return this.http.post<State[]>(this.basePath + this.task + 'updateTask', body);
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

  public override moveToTrashBin(token: string, project: string, uid: string): Observable<State[]> {
    const body = {
      token: token,
      project: project,
      uid: uid
    }
    return this.http.post<State[]>(this.basePath + this.task + 'moveToTrashBin', body);
  }

  public override getTrashBin(token: string, project: string): Observable<Task[]> {
    const body = {
      token: token,
      project: project
    }
    return this.http.post<Task[]>(this.basePath + this.task + 'getTrashBin', body);
  }

  public override deleteTask(token: string, project: string, uid: string): Observable<Task[]> {
    const body = {
      token: token,
      project: project,
      uid: uid
    }
    return this.http.post<Task[]>(this.basePath + this.task + 'deleteTask', body);
  }
  
  public override restoreTask(token: string, project: string, uid: string): Observable<Task[]> {
    const body = {
      token: token,
      project: project,
      uid: uid
    }
    return this.http.post<Task[]>(this.basePath + this.task + 'restoreTask', body);
  }

  public override clearTrashBin(token: string, project: string): Observable<Response> {
    const body = {
      token: token,
      project: project
    }
    return this.http.post<Response>(this.basePath + this.task + 'clearTrashBin', body);
  }

  // ### NOTIFICATIONS ###
  public override getNotifications(token: string, project: string, username: string): Observable<Notification[]> {
    const body = {
      token: token,
      project: project,
      username: username
    }
    return this.http.post<Notification[]>(this.basePath + this.notification + 'getNotifications', body);
  }

  public override updateNotifications(token: string, username: string, project: string, seen: string[], removed: string[]): Observable<Notification[]> {
    const body = {
      token: token,
      username: username,
      project: project,
      seen: seen,
      removed: removed
    }
    return this.http.post<Notification[]>(this.basePath + this.notification + 'updateNotifications', body);
  }


  // ### STATS ###
  public override optimizeOrder(token: string): Observable<Response> {
    const body = {
      token: token
    }
    return this.http.post<Response>(this.basePath + this.statsRoute + 'optimizeOrder', body);
  }

  public override stats(token: string): Observable<AssignedStats[]> {
    const body = {
      token: token
    }
    return this.http.post<AssignedStats[]>(this.basePath + this.statsRoute + 'stats', body);
  }

  public override statLeaders(token: string): Observable<StatLeaders> {
    const body = {
      token: token
    }
    return this.http.post<StatLeaders>(this.basePath + this.statsRoute + 'statLeaders', body);
  }

  public override taskAmount(token: string): Observable<CategoryStats> {
    const body = {
      token: token
    }
    return this.http.post<CategoryStats>(this.basePath + this.statsRoute + 'taskAmount', body);
  }

  public override averageTime(token: string): Observable<CategoryStats> {
    const body = {
      token: token
    }
    return this.http.post<CategoryStats>(this.basePath + this.statsRoute + 'averageTime', body);
  }

  public override wip(token: string): Observable<number> {
    const body = {
      token: token
    }
    return this.http.post<number>(this.basePath + this.statsRoute + 'wip', body);
  }

}
