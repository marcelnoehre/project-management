import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationsFeedComponent } from '../../notifications-feed/notifications-feed.component';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
	selector: 'app-toolbar-profile-menu',
	templateUrl: './toolbar-profile-menu.component.html',
	styleUrls: ['./toolbar-profile-menu.component.scss']
})
export class ToolbarProfileMenuComponent {
	@ViewChild('menu', { static: false })	menu!: MatMenu;

	public fullName;
	public profilePicture;
	public initials;
	public color;

	constructor(
    private router: Router,
		private storage: StorageService,
		private user: UserService,
		private dialog: MatDialog,
		private snackbar: SnackbarService,
		private translate: TranslateService,
		private notifications: NotificationsService
	) {
		this.fullName = this.user.fullName;
		this.profilePicture = this.user.profilePicture;
		this.initials = this.user.initials;
		this.color = this.user.color;
	}

	public logout(): void {
		this.storage.deleteSessionEntry('user');
		this.user.user = this.storage.getSessionEntry('user');
		this.snackbar.open(this.translate.instant('SUCCESS.LOGOUT'));
		this.router.navigateByUrl('/login');
	}

	public showNotificationsFeed() {
		this.dialog.open(NotificationsFeedComponent);
	}

	public showNotifications() {
		return this.user.notificationsEnabled;
	}

	public unseenNotifications() {
		return this.notifications.unseenNotifications >= 10 ? '+' : this.notifications.unseenNotifications;
	}
}
