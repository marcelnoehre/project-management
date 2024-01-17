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
	public profilePicture;
	public initials;
	public color;

	constructor(
    private router: Router,
		private storage: StorageService,
		private user: UserService,
		private api: ApiService,
		private snackbar: SnackbarService,
		private translate: TranslateService
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
}
