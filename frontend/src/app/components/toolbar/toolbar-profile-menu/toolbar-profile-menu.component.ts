import { Component, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
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
		private user: UserService
	) {
		this.fullName = this.getFullName();
	}

	public logout(): void {
    	this.storage.deleteSessionEntry('user');
		this.user.user = this.storage.getSessionEntry('user');
    	this.router.navigateByUrl('/login');
	}

	public getFullName() {
		return this.storage.getSessionEntry('user')?.fullName || 'No User';
	}
}
