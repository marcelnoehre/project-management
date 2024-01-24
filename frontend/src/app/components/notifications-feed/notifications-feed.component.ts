import { Component, OnDestroy, OnInit } from '@angular/core';
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
    private notification: NotificationsService
  ) {

  }

  ngOnInit(): void {
    this.notifications = this.notification.getNotifications;
  }

  ngOnDestroy(): void {
    this.notification.update(this.updateSeen, this.updateRemove);
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

  isNew(seen: boolean)  {
    return seen ? '' : 'new';
  }
}
