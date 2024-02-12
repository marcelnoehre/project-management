import { Injectable, OnInit } from '@angular/core';
import { ApiService } from './api/api.service';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { SnackbarService } from './snackbar.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Notification } from '../interfaces/data/notification';
import { ErrorService } from './error.service';

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
    private translate: TranslateService,
    private _error: ErrorService
  ) { }

  init(): void {
    this.loading = true;
    this.api.getNotifications(this.user.token).subscribe(
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
        this._error.handleApiError(error);
      }
    );
  }

  update(seen: string[], removed: string[]): void {
    this.api.updateNotifications(this.user.token, seen, removed).subscribe(
      (response) => {
        this.notifications = response;
        this.unseen = 0;
        this.notifications.forEach((notification) => {
          if (!notification.seen) {
            this.unseen++;
          }
        });
      },
      (error) => {
        this._error.handleApiError(error);
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
