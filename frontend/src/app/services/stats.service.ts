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
  private _steps = ['optimizeOrder', 'personalStats', 'stats', 'statLeaders', 'taskAmount', 'averageTime', 'wip', 'taskProgress', 'projectRoadmap'];
  private _information = ['PERSONAL_STATS', 'STATS', 'STAT_LEADERS', 'TASK_AMOUNT', 'AVERAGE_TIME', 'WIP', 'TASK_PROGRESS', 'PROJECT_ROADMAP', 'DONE'];
  private _updateSubject = new Subject<Loading>();
  private _data: any = {
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

  private _stats: { [key: string]: () => any } = {
    optimizeOrder: this._getOptimizeOrder.bind(this),
    personalStats: this._getPersonalStats.bind(this),
    stats: this._getStats.bind(this),
    statLeaders: this._getStatLeaders.bind(this),
    taskAmount: this._getTaskAmount.bind(this),
    averageTime: this._getAverageTime.bind(this),
    wip: this._getWip.bind(this),
    taskProgress: this._getTaskProgress.bind(this),
    projectRoadmap: this._getProjectRoadmap.bind(this)
  };
  
  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _storage: StorageService,
    private _error: ErrorService
  ) { }

  async init() {
    this._data = {
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
    if (this._storage.getSessionEntry('statsRetrieval') === true) {
      await new Promise<void>(done => setTimeout(() => done(), 500));
      this._submitUpdate({ step: 'storage', information: 'STORAGE', percentage: 1, data: this._storage.getSessionEntry('stats') });
    } else {
      this._submitUpdate({ step: 'init', information: 'OPTIMIZE_ORDER', percentage: 0/9, data: null });
      for (let i = 0; i < this._steps.length; i++) {
        this._submitUpdate({ step: this._steps[i], information: this._information[i], percentage: (i + 1) / 9, data: await this._stats[this._steps[i]]() });
      }
      this._storage.setSessionEntry('stats', this._data);
      this._storage.setSessionEntry('statsRetrieval', true);
    }
  }

  private _submitUpdate(update: Loading) {
    this._updateSubject.next(update);
  }

  private async _getOptimizeOrder() {
    try {
      this._data['optimizeOrder'] = await lastValueFrom(this._api.optimizeOrder(this._user.token));
      return this._data['optimizeOrder'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  private async _getPersonalStats() {
    try {
      this._data['personalStats'] = await lastValueFrom(this._api.personalStats(this._user.token));
      return this._data['personalStats'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  private async _getStats() {
    try {
      this._data['stats'] = await lastValueFrom(this._api.stats(this._user.token));
      return this._data['stats'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  private async _getStatLeaders() {
    try {
      this._data['statLeaders'] = await lastValueFrom(this._api.statLeaders(this._user.token));
      return this._data['statLeaders'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  private async _getTaskAmount() {
    try {
      this._data['taskAmount'] = await lastValueFrom(this._api.taskAmount(this._user.token));
      return this._data['taskAmount'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  private async _getAverageTime() {
    try {
      this._data['averageTime'] = await lastValueFrom(this._api.averageTime(this._user.token));
      return this._data['averageTime'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  private async _getWip() {
    try {
      this._data['wip'] = await lastValueFrom(this._api.wip(this._user.token));
      return this._data['wip'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  private async _getTaskProgress() {
    try {
      this._data['taskProgress'] = await lastValueFrom(this._api.taskProgress(this._user.token));
      return this._data['taskProgress'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  private async _getProjectRoadmap() {
    try {
      this._data['projectRoadmap'] = await lastValueFrom(this._api.projectRoadmap(this._user.token));
      return this._data['projectRoadmap'];
    } catch (error) {
      this._error.handleApiError(error);
      return null;
    }
  }

  public getUpdateSubject(): Observable<Loading> {
    return this._updateSubject.asObservable();
  }

  public async regenerateAll() {
    this._storage.deleteSessionEntry('stats');
    this._storage.deleteSessionEntry('statsRetrieval');
    this.init();
  }

  public async regenerateStat(stat: string) {
    return this._stats[stat]();
  }
}
