import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';
import { UserService } from './user.service';
import { Notification } from '../interfaces/data/notification';
import { ErrorService } from './error.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _loading = false;
  private _notifications: Notification[] = [];
  private _unseen = 0;

  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _error: ErrorService
  ) { }

  private _updateUnseen(): void {
    this._unseen = 0;
    this._notifications.forEach((notification) => {
      if (!notification.seen) {
        this._unseen++;
      }
    });
  }

  public async init(): Promise<void> {
    try {
      this._loading = true;
      this._notifications = await lastValueFrom(this._api.getNotifications(this._user.token));
      this._updateUnseen();
      this._loading = false;
    } catch (error) {
      this._loading = false;
      this._error.handleApiError(error);
    }
  }

  public async update(seen: string[], removed: string[]): Promise<void> {
    try {
      this._notifications = await lastValueFrom(this._api.updateNotifications(this._user.token, seen, removed));
      this._updateUnseen();
    } catch (error) {
      this._error.handleApiError(error);
    }
  }

  public isLoading(): boolean {
    return this._loading;
  }

  public get getNotifications(): Notification[] {
    return this._notifications;
  }

  public get unseenNotifications(): number {
    return this._unseen;
  }
  
}
