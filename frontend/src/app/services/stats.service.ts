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
        // this.api.stats(token).subscribe(
        //   (response) => {
        //     console.log(response);
        //   },
        //   (error) => {
  
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
