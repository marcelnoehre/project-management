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
      this.api.optimizeOrder(this.user.token, this.user.project).subscribe(
        (response) => {

        },
        (error) => {
  
        }
      );
      this.calculated = true;
      this.storage.setSessionEntry('stats', this.calculated);
    }
  }
}
