import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';
import { UserService } from './user.service';
import { Observable, Subject } from 'rxjs';
import { Loading } from '../interfaces/loading';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private updateSubject = new Subject<Loading>();
  private calculated: boolean = false;
  
  constructor(
    private api: ApiService,
    private user: UserService
  ) { }

  init() {    
    if (!this.calculated) {
      const token = this.user.token;
      this.api.optimizeOrder(token).subscribe(
        (response) => {
          this.submitUpdate({ step: 'optimizeOrder', percentage: 1/9, data: response });
          this.api.personalStats(token).subscribe(
            (response) => {
              this.submitUpdate({ step: 'personalStats', percentage: 2/9, data: response });
              this.api.stats(token).subscribe(
                (response) => {
                  this.submitUpdate({ step: 'stats', percentage: 3/9, data: response });
                  this.api.statLeaders(token).subscribe(
                    (response) => {
                      this.submitUpdate({ step: 'statLeaders', percentage: 4/9, data: response });
                      this.api.taskAmount(token).subscribe(
                        (response) => {
                          this.submitUpdate({ step: 'taskAmount', percentage: 5/9, data: response });
                          this.api.averageTime(token).subscribe(
                            (response) => {
                              this.submitUpdate({ step: 'averageTime', percentage: 6/9, data: response });
                              this.api.wip(token).subscribe(
                                (response) => {
                                  this.submitUpdate({ step: 'wip', percentage: 7/9, data: response });
                                  this.api.taskProgress(token).subscribe(
                                    (response) => {
                                      this.submitUpdate({ step: 'taskProgress', percentage: 8/9, data: response });
                                      this.api.projectRoadmap(token).subscribe(
                                        (response) => {
                                          this.submitUpdate({ step: 'projectRoadmap', percentage: 9/9, data: response });
                                        },
                                        (error) => { }
                                      );
                                    },
                                    (error) => { }
                                  );
                                },
                                (error) => { }
                              );
                            },
                            (error) => { }
                          );
                        },
                        (error) => { }
                      );
                    },
                    (error) => { }
                  );
                },
                (error) => { }
              );
            },
            (error) => { }
          );
        },
        (error) => { }
      );
    }
  }

  public submitUpdate(update: Loading) {
    this.updateSubject.next(update);
  }

  getUpdateSubject(): Observable<Loading> {
    return this.updateSubject.asObservable();
  }

}
