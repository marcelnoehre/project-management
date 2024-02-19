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
import { DeviceService } from 'src/app/services/device.service';

@Component({
	selector: 'app-toolbar-profile-menu',
	templateUrl: './toolbar-profile-menu.component.html',
	styleUrls: ['./toolbar-profile-menu.component.scss']
})
export class ToolbarProfileMenuComponent {
	@ViewChild('menu', { static: false })	menu!: MatMenu;

	public fullName = '';
	public profilePicture = '';
	public initials = '';
	public color = '';

	constructor(
    	private _router: Router,
		private _storage: StorageService,
		private _user: UserService,
		private _dialog: MatDialog,
		private _snackbar: SnackbarService,
		private _translate: TranslateService,
		private _notifications: NotificationsService,
		private _device: DeviceService
	) {
		this.fullName = this._user.fullName;
		this.profilePicture = this._user.profilePicture;
		this.initials = this._user.initials;
		this.color = this._user.color;
	}

	public logout(): void {
		this._storage.clearSession();
		this._user.user = this._storage.getSessionEntry('user');
		this._snackbar.open(this._translate.instant('SUCCESS.LOGOUT'));
		this._router.navigateByUrl('/login');
	}

	public showNotificationsFeed(): void {
		this._dialog.open(NotificationsFeedComponent);
	}

	public unseenNotifications(): number | string {
		return this._notifications.unseenNotifications >= 10 ? '+' : this._notifications.unseenNotifications;
	}

	public showNotifications(): boolean {
		return this._user.notificationsEnabled;
	}

	public isSmallScreen(): boolean {
		return this._device.isSmallScreen();
	}
}
