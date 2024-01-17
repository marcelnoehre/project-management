import { Component, EventEmitter, Output } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
	@Output() sidenavClickEvent = new EventEmitter<void>();
	notificationsEnabled: boolean = true;

	constructor(
		private user: UserService
	) {
	}

	public isLoggedIn(): unknown {
		return this.user.isLoggedIn && this.user.project !== '';
	}

	public toggleSidenav(): void {
		this.sidenavClickEvent.emit();
	}

	public toggleNotifcations(): void {
		this.notificationsEnabled = !this.notificationsEnabled;
	}
}
