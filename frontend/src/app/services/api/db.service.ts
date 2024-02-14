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
import { Stats } from 'src/app/interfaces/data/stats';
import { RequestService } from '../request.service';
import { RequestType } from 'src/app/enums/request-type.enum';

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

  constructor(
    private http: HttpClient,
	  private request: RequestService
  ) {
    super();
  }

  // ### AUTH ###
  public override login(username: string, password: string): Observable<User> {
    const body = {
      username: username,
      password: password
    };
    return this.request.send<User>(RequestType.POST, this.basePath + this.auth + 'login', body);
	}

  public override register(username: string, fullName: string, language: string, password: string): Observable<Response> {
    const body = {
      username: username,
      fullName: fullName,
      language: language,
      password: password
    };
    return this.request.send<Response>(RequestType.POST, this.basePath + this.auth + 'register', body);
  }

  public override verify(token: string): Observable<User> {
    const data = {
      token: token
    }
    return this.request.send<User>(RequestType.GET, this.basePath + this.auth + 'verify', data);
  }

  public override refreshToken(token: string): Observable<string> {
    const data = {
      token: token
    }
    return this.request.send<string>(RequestType.GET, this.basePath + this.auth + 'refreshToken', data);
  }

  public override updateUser(token: string, attribute: string, value: string): Observable<Response> {
    const body = {
      token: token,
      attribute: attribute,
      value: value
    }
    return this.request.send<Response>(RequestType.PUT, this.basePath + this.auth + 'updateUser', body);
  }

  public override toggleNotifications(token: string, notificationsEnabled: boolean): Observable<Response> {
    const body = {
      token: token,
      notificationsEnabled: notificationsEnabled
    }
    return this.request.send<Response>(RequestType.PUT, this.basePath + this.auth + 'toggleNotifications', body);
  }

  public override deleteUser(token: string): Observable<Response> {
    const data = {
      token: token
    }
    return this.request.send<Response>(RequestType.DELETE, this.basePath + this.auth + 'deleteUser', data);
  }


  // ### PROJECT ###
  public override createProject(token: string, project: string): Observable<Response> {
    const body = {
      token: token,
      project: project
    };
    return this.request.send<Response>(RequestType.POST, this.basePath + this.project + 'create-project', body);
  }

  public override getTeamMembers(token: string): Observable<User[]> {
    const data = {
      token: token
    };
    return this.request.send<User[]>(RequestType.GET, this.basePath + this.project + 'get-team-members', data);
  }

  public override inviteUser(token: string, username: string): Observable<User> {
    const body = {
      token: token,
      username: username
    };
    return this.request.send<User>(RequestType.PUT, this.basePath + this.project + 'invite', body);
  }

  public override handleInvite(token: string, decision: boolean): Observable<Response> {
    const body = {
      token: token,
      decision: decision
    };
    return this.request.send<Response>(RequestType.PUT, this.basePath + this.project + 'handleInvite', body);
  }

  public override updatePermission(token: string, username: string, permission: Permission): Observable<User[]> {
    const body = {
      token: token,
      username: username,
      permission: permission
    }
    return this.request.send<User[]>(RequestType.PUT, this.basePath + this.project + 'updatePermission', body);
  }

  public override removeUser(token: string, username: string): Observable<Response> {
    const body = {
      token: token,
      username: username
    };
    return this.request.send<Response>(RequestType.PUT, this.basePath + this.project + 'remove', body);
  }

  public override leaveProject(token: string): Observable<Response> {
    const body = {
      token: token
    };
    return this.request.send<Response>(RequestType.PUT, this.basePath + this.project + 'leave', body);
  }


  // ### TASKS ###
  public override createTask(token: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
    const body = {
      token: token,
      title: title,
      description: description,
      assigned: assigned,
      state: state
    };
    return this.request.send<Response>(RequestType.POST, this.basePath + this.task + 'createTask', body);
  }
  
  public override importTasks(token: string, tasks: Task[]): Observable<Progress> {
    const body = {
      token: token,
      tasks: tasks
    }
    return this.request.send<Progress>(RequestType.POST, this.basePath + this.task + 'importTasks', body);
  }
  
  public override getTaskList(token: string): Observable<State[]> {
    const data = {
      token: token
    };
    return this.request.send<State[]>(RequestType.GET, this.basePath + this.task + 'getTaskList', data);
  }

  public override updateTask(token: string, task: Task): Observable<State[]> {
    const body = {
      token: token,
      task: task
    }
    return this.request.send<State[]>(RequestType.PUT, this.basePath + this.task + 'updateTask', body);
  }

  public override updatePosition(token: string, uid: string, state: string, order: number): Observable<State[]> {
    const body = {
      token: token,
      uid: uid,
      state: state,
      order: order
    }
    return this.request.send<State[]>(RequestType.PUT, this.basePath + this.task + 'updatePosition', body);
  }

  public override moveToTrashBin(token: string, uid: string): Observable<State[]> {
    const body = {
      token: token,
      uid: uid
    }
    return this.request.send<State[]>(RequestType.PUT, this.basePath + this.task + 'moveToTrashBin', body);
  }

  public override getTrashBin(token: string): Observable<Task[]> {
    const data = {
      token: token
    }
    return this.request.send<Task[]>(RequestType.GET, this.basePath + this.task + 'getTrashBin', data);
  }

  public override deleteTask(token: string, uid: string): Observable<Task[]> {
    const data = {
      token: token,
      uid: uid
    }
    return this.request.send<Task[]>(RequestType.DELETE, this.basePath + this.task + 'deleteTask', data);
  }
  
  public override restoreTask(token: string, uid: string): Observable<Task[]> {
    const body = {
      token: token,
      uid: uid
    }
    return this.request.send<Task[]>(RequestType.PUT, this.basePath + this.task + 'restoreTask', body);
  }

  public override clearTrashBin(token: string): Observable<Response> {
    const data = {
      token: token
    }
    return this.request.send<Response>(RequestType.DELETE, this.basePath + this.task + 'clearTrashBin', data);
  }

  // ### NOTIFICATIONS ###
  public override getNotifications(token: string): Observable<Notification[]> {
    const data = {
      token: token
    }
    return this.request.send<Notification[]>(RequestType.GET, this.basePath + this.notification + 'getNotifications', data);
  }

  public override updateNotifications(token: string, seen: string[], removed: string[]): Observable<Notification[]> {
    const body = {
      token: token,
      seen: seen,
      removed: removed
    }
    return this.request.send<Notification[]>(RequestType.PUT, this.basePath + this.notification + 'updateNotifications', body);
  }


  // ### STATS ###
  public override optimizeOrder(token: string): Observable<Response> {
    const body = {
      token: token
    }
    return this.request.send<Response>(RequestType.PUT, this.basePath + this.statsRoute + 'optimizeOrder', body);
  }

  public override personalStats(token: string): Observable<Stats> {
    const data = {
      token: token
    }
    return this.request.send<Stats>(RequestType.GET, this.basePath + this.statsRoute + 'personalStats', data);
  }

  public override stats(token: string): Observable<AssignedStats[]> {
    const data = {
      token: token
    }
    return this.request.send<AssignedStats[]>(RequestType.GET, this.basePath + this.statsRoute + 'stats', data);
  }

  public override statLeaders(token: string): Observable<StatLeaders> {
    const data = {
      token: token
    }
    return this.request.send<StatLeaders>(RequestType.GET, this.basePath + this.statsRoute + 'statLeaders', data);
  }

  public override taskAmount(token: string): Observable<CategoryStats> {
    const data = {
      token: token
    }
    return this.request.send<CategoryStats>(RequestType.GET, this.basePath + this.statsRoute + 'taskAmount', data);
  }

  public override averageTime(token: string): Observable<CategoryStats> {
    const data = {
      token: token
    }
    return this.request.send<CategoryStats>(RequestType.GET, this.basePath + this.statsRoute + 'averageTime', data);
  }

  public override wip(token: string): Observable<number> {
    const data = {
      token: token
    }
    return this.request.send<number>(RequestType.GET, this.basePath + this.statsRoute + 'wip', data);
  }

  public override taskProgress(token: string): Observable<any> {
    const data = {
      token: token
    }
    return this.request.send<any>(RequestType.GET, this.basePath + this.statsRoute + 'taskProgress', data);
  }

  public override projectRoadmap(token: string): Observable<any> {
    const data = {
      token: token
    }
    return this.request.send<any>(RequestType.GET, this.basePath + this.statsRoute + 'projectRoadmap', data);
  }

}
