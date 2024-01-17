import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api/api.service';
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
		private storage: StorageService,
		private router: Router,
		private snackbar: SnackbarService,
		private translate: TranslateService
	) {
	}

	public isLoggedIn(): unknown {
		this.notificationsEnabled = this.user.user?.notificationsEnabled;
		return this.user.isLoggedIn && this.user.project !== '';
	}

	public toggleSidenav(): void {
		this.sidenavClickEvent.emit();
	}

	public toggleNotifcations(): void {
		this.user.notificationsEnabled = !this.notificationsEnabled;
		this.api.toggleNotifications(this.user.token, this.user.username, this.user.notificationsEnabled).subscribe(
			(response) => {
				this.snackbar.open(this.translate.instant(response.message));
			},
			(error) => {
				if (error.status === 403) {
					this.storage.clearSession();
					this.router.navigateByUrl('/login');
				  }
				  this.snackbar.open(this.translate.instant(error.error.message));
			}
		);
	}
}
