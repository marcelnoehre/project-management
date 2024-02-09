import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';
import { UserService } from './user.service';
import { Observable, Subject } from 'rxjs';
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
    this.api.optimizeOrder(token).subscribe(
      (response) => {
        this.data['optimizeOrder'] = response;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }

  async personalStats(token: string) {
    this.api.personalStats(token).subscribe(
      (response) => {
        this.data['personalStats'] = response;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }

  async stats(token: string) {
    this.api.stats(token).subscribe(
      (response) => {
        this.data['stats'] = response;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }

  async statLeaders(token: string) {
    this.api.statLeaders(token).subscribe(
      (response) => {
        this.data['statLeaders'] = response;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }

  async taskAmount(token: string) {
    this.api.taskAmount(token).subscribe(
      (response) => {
        this.data['taskAmount'] = response;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }

  async averageTime(token: string) {
    this.api.averageTime(token).subscribe(
      (response) => {
        this.data['averageTime'] = response;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }

  async wip(token: string) {
    this.api.wip(token).subscribe(
      (response) => {
        this.data['wip'] = response;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }

  async taskProgress(token: string) {
    this.api.taskProgress(token).subscribe(
      (response) => {
        this.data['taskProgress'] = response;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }

  async projectRoadmap(token: string) {
    this.api.projectRoadmap(token).subscribe(
      (response) => {
        this.data['projectRoadmap'] = response;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }




}
