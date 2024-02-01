import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';
import { UserService } from './user.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private calculated: boolean = false;
  
  constructor(
    private api: ApiService,
    private user: UserService,
    private storage: StorageService
  ) { }

  init() {    
    if (this.storage.getSessionEntry('stats') === true) {
      this.calculated = true;
    }
    if (!this.calculated) {
      const token = this.user.token;
      // this.api.optimizeOrder(token).subscribe(
      //   (response) => {
          this.api.personalStats(token).subscribe(
            (response) => {
              console.log(response);
            },
            (error) => {

            }
          );
        // this.api.stats(token).subscribe(
        //   (response) => {
          // this.api.statLeaders(token).subscribe(
          //   (response) => {
            // this.api.taskAmount(token).subscribe(
            //   (response) => {
                // this.api.averageTime(token).subscribe(
                //   (response) => {
                  // this.api.wip(token).subscribe(
                  //   (response) => {
                    // this.api.taskProgress(token).subscribe(
                    //   (response) => {
                      // this.api.projectRoadmap(token).subscribe(
                      //   (response) => {
                      //     console.log(response);
                      //   },
                      //   (error) => {

                      //   }
                      // )
                    //   },
                    //   (error) => {

                    //   }
                    // );
                  //   },
                  //   (error) => {

                  //   }
                  // );
                //   },
                //   (error) => {

                //   }
                // );
            //   },
            //   (error) => {
          
            //   }
            // );
          //   },
          //   (error) => {
    
          //   }
          // );
        //   },
        //   (error) => {
        //
        //   }
        // );
      //   },
      //   (error) => {
  
      //   }
      // );
      this.calculated = true;
      this.storage.setSessionEntry('stats', this.calculated);
    }
  }
}
