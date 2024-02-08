import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api/api.service';
import { DeviceService } from 'src/app/services/device.service';
import { ErrorService } from 'src/app/services/error.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
	@Output() sidenavClickEvent = new EventEmitter<void>();
	notificationsEnabled: boolean = this.user.user?.notificationsEnabled;

	constructor(
		private user: UserService,
		private api: ApiService,
		private snackbar: SnackbarService,
		private translate: TranslateService,
		private device: DeviceService,
		private _error: ErrorService
	) {
	}

	public isLoggedIn(): unknown {
		this.notificationsEnabled = this.user.user?.notificationsEnabled;
		return this.user.isLoggedIn && this.user.project !== '';
	}

	public toggleSidenav(): void {
		this.sidenavClickEvent.emit();
	}

	hideSidenav(): boolean {
		return this.device.activeRoute === '/';
	}

	public toggleNotifcations(): void {
		this.user.notificationsEnabled = !this.notificationsEnabled;
		this.api.toggleNotifications(this.user.token, this.user.username, this.user.notificationsEnabled).subscribe(
			(response) => {
				this.snackbar.open(this.translate.instant(response.message));
			},
			(error) => {
				this._error.handleApiError(error);
			}
		);
	}
}
