import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';
import { UserService } from './user.service';
import { Observable, Subject, lastValueFrom } from 'rxjs';
import { Loading } from '../interfaces/loading';
import { StorageService } from './storage.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private updateSubject = new Subject<Loading>();
  private data: any = {
    optimizeOrder: null,
    personalStats: null,
    stats: null,
    statLeaders: null,
    taskAmount: null,
    averageTime: null,
    wip: null,
    taskProgress: null,
    projectRoadmap: null
  }
  
  constructor(
    private api: ApiService,
    private user: UserService,
    private storage: StorageService,
    private _error: ErrorService
  ) { }

  async init() {
    this.data = {
      optimizeOrder: null,
      personalStats: null,
      stats: null,
      statLeaders: null,
      taskAmount: null,
      averageTime: null,
      wip: null,
      taskProgress: null,
      projectRoadmap: null
    }
    if (this.storage.getSessionEntry('statsRetrieval') === true) {
      await new Promise<void>(done => setTimeout(() => done(), 500));
      this.submitUpdate({ step: 'storage', information: 'STORAGE', percentage: 1, data: this.storage.getSessionEntry('stats') });
    } else {
      const token = this.user.token;
      this.submitUpdate({ step: 'init', information: 'OPTIMIZE_ORDER', percentage: 0/9, data: null });
      this.submitUpdate({ step: 'optimizeOrder', information: 'PERSONAL_STATS', percentage: 1/9, data: await this.optimizeOrder(token) });
      this.submitUpdate({ step: 'personalStats', information: 'STATS', percentage: 2/9, data: await this.personalStats(token) });
      this.submitUpdate({ step: 'stats', information: 'STAT_LEADERS', percentage: 3/9, data: await this.stats(token) });
      this.submitUpdate({ step: 'statLeaders', information: 'TASK_AMOUNT', percentage: 4/9, data: await this.statLeaders(token) });
      this.submitUpdate({ step: 'taskAmount', information: 'AVERAGE_TIME', percentage: 5/9, data: await this.taskAmount(token) });
      this.submitUpdate({ step: 'averageTime', information: 'WIP', percentage: 6/9, data: await this.averageTime(token) });
      this.submitUpdate({ step: 'wip', information: 'TASK_PROGRESS', percentage: 7/9, data: await this.wip(token) });
      this.submitUpdate({ step: 'taskProgress', information: 'PROJECT_ROADMAP', percentage: 8/9, data: await this.taskProgress(token) });
      this.submitUpdate({ step: 'projectRoadmap', information: 'DONE', percentage: 9/9, data: await this.projectRoadmap(token) });
      this.storage.setSessionEntry('stats', this.data);
      this.storage.setSessionEntry('statsRetrieval', true);
    }
  }

  public submitUpdate(update: Loading) {
    this.updateSubject.next(update);
  }

  getUpdateSubject(): Observable<Loading> {
    return this.updateSubject.asObservable();
  }

  async optimizeOrder(token: string) {
    try {
      this.data['optimizeOrder'] = await lastValueFrom(this.api.optimizeOrder(token));
      return this.data['optimizeOrder'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async personalStats(token: string) {
    try {
      this.data['personalStats'] = await lastValueFrom(this.api.personalStats(token));
      return this.data['personalStats'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async stats(token: string) {
    try {
      this.data['stats'] = await lastValueFrom(this.api.stats(token));
      return this.data['stats'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async statLeaders(token: string) {
    try {
      this.data['statLeaders'] = await lastValueFrom(this.api.statLeaders(token));
      return this.data['statLeaders'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async taskAmount(token: string) {
    try {
      this.data['taskAmount'] = await lastValueFrom(this.api.taskAmount(token));
      return this.data['taskAmount'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async averageTime(token: string) {
    try {
      this.data['averageTime'] = await lastValueFrom(this.api.averageTime(token));
      return this.data['averageTime'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async wip(token: string) {
    try {
      this.data['wip'] = await lastValueFrom(this.api.wip(token));
      return this.data['wip'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async taskProgress(token: string) {
    try {
      this.data['taskProgress'] = await lastValueFrom(this.api.taskProgress(token));
      return this.data['taskProgress'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async projectRoadmap(token: string) {
    try {
      this.data['projectRoadmap'] = await lastValueFrom(this.api.projectRoadmap(token));
      return this.data['projectRoadmap'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async regenerateAll() {
    this.storage.deleteSessionEntry('stats');
    this.storage.deleteSessionEntry('statsRetrieval');
    this.init();
  }
}
