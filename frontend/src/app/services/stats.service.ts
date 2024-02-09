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
      this.submitUpdate({ step: 'init', information: 'OPTIMIZE_ORDER', percentage: 1/9, data: null });
      const token = this.user.token;
      this.api.optimizeOrder(token).subscribe(
        (response) => {
          this.data['optimizeOrder'] = response;
          this.submitUpdate({ step: 'optimizeOrder', information: 'PERSONAL_STATS', percentage: 1/9, data: response });
          this.api.personalStats(token).subscribe(
            (response) => {
              this.data['personalStats'] = response;
              this.submitUpdate({ step: 'personalStats', information: 'STATS', percentage: 2/9, data: response });
              this.api.stats(token).subscribe(
                (response) => {
                  this.data['stats'] = response;
                  this.submitUpdate({ step: 'stats', information: 'STAT_LEADERS', percentage: 3/9, data: response });
                  this.api.statLeaders(token).subscribe(
                    (response) => {
                      this.data['statLeaders'] = response;
                      this.submitUpdate({ step: 'statLeaders', information: 'TASK_AMOUNT', percentage: 4/9, data: response });
                      this.api.taskAmount(token).subscribe(
                        (response) => {
                          this.data['taskAmount'] = response;
                          this.submitUpdate({ step: 'taskAmount', information: 'AVERAGE_TIME', percentage: 5/9, data: response });
                          this.api.averageTime(token).subscribe(
                            (response) => {
                              this.data['averageTime'] = response;
                              this.submitUpdate({ step: 'averageTime', information: 'WIP', percentage: 6/9, data: response });
                              this.api.wip(token).subscribe(
                                (response) => {
                                  this.data['wip'] = response;
                                  this.submitUpdate({ step: 'wip', information: 'TASK_PROGRESS', percentage: 7/9, data: response });
                                  this.api.taskProgress(token).subscribe(
                                    (response) => {
                                      this.data['taskProgress'] = response;
                                      this.submitUpdate({ step: 'taskProgress', information: 'PROJECT_ROADMAP', percentage: 8/9, data: response });
                                      this.api.projectRoadmap(token).subscribe(
                                        (response) => {
                                          this.data['projectRoadmap'] = response;
                                          this.submitUpdate({ step: 'projectRoadmap', information: 'DONE', percentage: 9/9, data: response });
                                          this.storage.setSessionEntry('stats', this.data);
                                          this.storage.setSessionEntry('statsRetrieval', true);
                                        },
                                        (error) => {
                                          this._error.handleApiError(error);
                                        }
                                      );
                                    },
                                    (error) => {
                                      this._error.handleApiError(error);
                                    }
                                  );
                                },
                                (error) => {
                                  this._error.handleApiError(error);
                                }
                              );
                            },
                            (error) => {
                              this._error.handleApiError(error);
                            }
                          );
                        },
                        (error) => {
                          this._error.handleApiError(error);
                        }
                      );
                    },
                    (error) => {
                      this._error.handleApiError(error);
                    }
                  );
                },
                (error) => {
                  this._error.handleApiError(error);
                }
              );
            },
            (error) => {
              this._error.handleApiError(error);
            }
          );
        },
        (error) => {
          this._error.handleApiError(error);
        }
      );
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
}
