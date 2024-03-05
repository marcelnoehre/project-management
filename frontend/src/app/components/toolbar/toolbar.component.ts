import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { DeviceService } from 'src/app/services/device.service';
import { ErrorService } from 'src/app/services/error.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
	@Output() sidenavClickEvent = new EventEmitter<void>();
	
	public notificationsEnabled: boolean = this._user.user?.notificationsEnabled;

	constructor(
		private _user: UserService,
		private _api: ApiService,
		private _snackbar: SnackbarService,
		private _translate: TranslateService,
		private _device: DeviceService,
		private _error: ErrorService
	) { }

	public toggleSidenav(): void {
		this.sidenavClickEvent.emit();
	}

	public async toggleNotifcations(): Promise<void> {
		this._user.notificationsEnabled = !this.notificationsEnabled;
		try {
			const response = await lastValueFrom(this._api.toggleNotifications(this._user.token, this._user.notificationsEnabled));
			this._snackbar.open(this._translate.instant(response.message));
		} catch (error) {
			this._error.handleApiError(error);
		}
	}

	public hideSidenav(): boolean {
		return this._device.activeRoute === '/';
	}

	public isLoggedIn(): boolean {
		this.notificationsEnabled = this._user.notificationsEnabled;
		return this._user.isLoggedIn && this._user.project !== '';
	}
}
