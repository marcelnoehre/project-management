import { Component, EventEmitter, Output } from '@angular/core';
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
		private user: UserService
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
	}
}
