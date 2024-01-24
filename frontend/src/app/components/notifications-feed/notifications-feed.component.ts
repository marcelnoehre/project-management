import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/interfaces/data/notification';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notifications-feed',
  templateUrl: './notifications-feed.component.html',
  styleUrls: ['./notifications-feed.component.scss']
})
export class NotificationsFeedComponent implements OnInit {
  notifications: Notification[] = [];
  
  constructor(
    private notification: NotificationsService
  ) {

  }
  ngOnInit(): void {
    this.notifications = this.notification.getNotifications;
  }
}
