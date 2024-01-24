import { Injectable, OnInit } from '@angular/core';
import { ApiService } from './api/api.service';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { SnackbarService } from './snackbar.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private loading: boolean = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private user: UserService,
    private storage: StorageService,
    private snackbar: SnackbarService,
    private translate: TranslateService
  ) { }

  init(): void {
    this.loading = true;
    this.api.getNotifications(this.user.token, this.user.project, this.user.username).subscribe(
      (response) => {
        this.loading = false;
        console.log(response);
      },
      (error) => {
        this.loading = false;
        if (error.status === 403) {
          this.storage.clearSession();
          this.router.navigateByUrl('/login');
        }
        this.snackbar.open(this.translate.instant(error.error.message));
      }
    );
  }

  isLoading(): boolean {
    return this.loading;
  }
  
}
