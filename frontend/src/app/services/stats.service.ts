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

  private stats: { [key: string]: () => any } = {
    optimizeOrder: this.getOptimizeOrder.bind(this),
    personalStats: this.getPersonalStats.bind(this),
    stats: this.getStats.bind(this),
    statLeaders: this.getStatLeaders.bind(this),
    taskAmount: this.getTaskAmount.bind(this),
    averageTime: this.getAverageTime.bind(this),
    wip: this.getWip.bind(this),
    taskProgress: this.getTaskProgress.bind(this),
    projectRoadmap: this.getProjectRoadmap.bind(this)
  };
  
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
      // TODO: loop based on stat retrieval by string 
      this.submitUpdate({ step: 'init', information: 'OPTIMIZE_ORDER', percentage: 0/9, data: null });
      this.submitUpdate({ step: 'optimizeOrder', information: 'PERSONAL_STATS', percentage: 1/9, data: await this.getOptimizeOrder() });
      this.submitUpdate({ step: 'personalStats', information: 'STATS', percentage: 2/9, data: await this.getPersonalStats() });
      this.submitUpdate({ step: 'stats', information: 'STAT_LEADERS', percentage: 3/9, data: await this.getStats() });
      this.submitUpdate({ step: 'statLeaders', information: 'TASK_AMOUNT', percentage: 4/9, data: await this.getStatLeaders() });
      this.submitUpdate({ step: 'taskAmount', information: 'AVERAGE_TIME', percentage: 5/9, data: await this.getTaskAmount() });
      this.submitUpdate({ step: 'averageTime', information: 'WIP', percentage: 6/9, data: await this.getAverageTime() });
      this.submitUpdate({ step: 'wip', information: 'TASK_PROGRESS', percentage: 7/9, data: await this.getWip() });
      this.submitUpdate({ step: 'taskProgress', information: 'PROJECT_ROADMAP', percentage: 8/9, data: await this.getTaskProgress() });
      this.submitUpdate({ step: 'projectRoadmap', information: 'DONE', percentage: 9/9, data: await this.getProjectRoadmap() });
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

  async getOptimizeOrder() {
    try {
      this.data['optimizeOrder'] = await lastValueFrom(this.api.optimizeOrder(this.user.token));
      return this.data['optimizeOrder'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async getPersonalStats() {
    try {
      this.data['personalStats'] = await lastValueFrom(this.api.personalStats(this.user.token));
      return this.data['personalStats'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async getStats() {
    try {
      this.data['stats'] = await lastValueFrom(this.api.stats(this.user.token));
      return this.data['stats'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async getStatLeaders() {
    try {
      this.data['statLeaders'] = await lastValueFrom(this.api.statLeaders(this.user.token));
      return this.data['statLeaders'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async getTaskAmount() {
    try {
      this.data['taskAmount'] = await lastValueFrom(this.api.taskAmount(this.user.token));
      return this.data['taskAmount'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async getAverageTime() {
    try {
      this.data['averageTime'] = await lastValueFrom(this.api.averageTime(this.user.token));
      return this.data['averageTime'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async getWip() {
    try {
      this.data['wip'] = await lastValueFrom(this.api.wip(this.user.token));
      return this.data['wip'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async getTaskProgress() {
    try {
      this.data['taskProgress'] = await lastValueFrom(this.api.taskProgress(this.user.token));
      return this.data['taskProgress'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  async getProjectRoadmap() {
    try {
      this.data['projectRoadmap'] = await lastValueFrom(this.api.projectRoadmap(this.user.token));
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

  async regenerateStat(stat: string) {
    return this.stats[stat]();
  }
}
