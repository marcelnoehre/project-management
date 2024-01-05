import { Component, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api/api.service';
import { EventService } from 'src/app/services/event.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-toolbar-profile-menu',
	templateUrl: './toolbar-profile-menu.component.html',
	styleUrls: ['./toolbar-profile-menu.component.scss']
})
export class ToolbarProfileMenuComponent {
	@ViewChild('menu', { static: false })	menu!: MatMenu;

	public fullName;

	constructor(
    private router: Router,
		private storage: StorageService, 
		private event: EventService,
		private user: UserService,
		private api: ApiService,
		private snackbar: SnackbarService,
		private translate: TranslateService
	) {
		this.fullName = this.getFullName();
	}

	public logout(): void {
		this.api.logout(this.user.token, this.user.username).subscribe(
			(response) => {
				this.storage.deleteSessionEntry('user');
				this.user.user = this.storage.getSessionEntry('user');
				this.snackbar.open(this.translate.instant(response.message));
				this.router.navigateByUrl('/login');
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

	public getFullName() {
		return this.storage.getSessionEntry('user')?.fullName || 'No User';
	}
}
