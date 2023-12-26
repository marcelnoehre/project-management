import { Component, EventEmitter, Output } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
	@Output() sidenavClickEvent = new EventEmitter<void>();

	constructor(
		private storage: StorageService
	) {
	}

	public isLoggedIn(): unknown {
		const user = this.getUser();
		return user?.isLoggedIn && user?.project !== ''
	}

	private getUser(): any {
		return this.storage.getSessionEntry('user');
	}

	public toggleSidenav(): void {
		this.sidenavClickEvent.emit();
	}
}
