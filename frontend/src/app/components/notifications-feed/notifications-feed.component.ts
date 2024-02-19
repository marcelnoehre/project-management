import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Notification } from 'src/app/interfaces/data/notification';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notifications-feed',
  templateUrl: './notifications-feed.component.html',
  styleUrls: ['./notifications-feed.component.scss']
})
export class NotificationsFeedComponent implements OnInit, OnDestroy {
  public notifications: Notification[] = [];
  private _updateSeen: string[] = [];
  private _updateRemove: string[] = [];
  
  constructor(
    private _notification: NotificationsService,
    private _translate: TranslateService
  ) {

  }

  ngOnInit(): void {
    this.notifications = this._notification.getNotifications;
5  }

  ngOnDestroy(): void {
    if (this._updateSeen.length || this._updateRemove.length) {
      this._updateSeen = this._updateSeen.filter(item => !this._updateRemove.includes(item));
      this._notification.update(this._updateSeen, this._updateRemove);
    }
  }

  public seen(index: number, uid: string): void {
    if (!this.notifications[index].seen) {
      this.notifications[index].seen = true;
      this._updateSeen.push(uid);
    }
  }

  public remove(index: number, uid: string): void {
    this.notifications.splice(index, 1);
    this._updateRemove.push(uid);
  }

  public encryptMessage(message: string, data: string[]): string {
    return this._translate.instant(message, {data_0: data[0], data_1: data[1]});
  }

  public isNew(seen: boolean): string  {
    return seen ? '' : 'new';
  }
}
