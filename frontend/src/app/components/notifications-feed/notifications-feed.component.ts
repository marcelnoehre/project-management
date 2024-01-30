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
  notifications: Notification[] = [];
  updateSeen: string[] = [];
  updateRemove: string[] = [];
  
  constructor(
    private notification: NotificationsService,
    private translate: TranslateService
  ) {

  }

  ngOnInit(): void {
    this.notifications = this.notification.getNotifications;
5  }

  ngOnDestroy(): void {
    if (this.updateSeen.length || this.updateRemove.length) {
      this.updateSeen = this.updateSeen.filter(item => !this.updateRemove.includes(item));
      this.notification.update(this.updateSeen, this.updateRemove);
    }
  }

  viewed(index: number, uid: string): void {
    if (!this.notifications[index].seen) {
      this.notifications[index].seen = true;
      this.updateSeen.push(uid);
    }
  }

  remove(index: number, uid: string): void {
    this.notifications.splice(index, 1);
    this.updateRemove.push(uid);
  }

  encryptMessage(message: string, data: string[]) {
    return this.translate.instant(message, {data_0: data[0], data_1: data[1]});
  }

  isNew(seen: boolean)  {
    return seen ? '' : 'new';
  }
}
