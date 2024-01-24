import { Injectable, OnInit } from '@angular/core';
import { ApiService } from './api/api.service';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { SnackbarService } from './snackbar.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Notification } from '../interfaces/data/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private loading: boolean = false;
  private notifications: Notification[] = [];
  private unseen: number = 0;

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
        this.notifications = response;
        this.notifications.forEach((notification) => {
          if (!notification.seen) {
            this.unseen++;
          }
        });
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

  update(seen: string[], removed: string[]): void {
    this.api.updateNotifications(this.user.token, this.user.username, seen, removed).subscribe(
      (response) => {
        this.notifications = response;
      },
      (error) => {
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

  get getNotifications(): Notification[] {
    return this.notifications;
  }

  get unseenNotifications(): number {
    return this.unseen;
  }
  
}
