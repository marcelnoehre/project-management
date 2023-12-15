import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

	constructor(
		private storage: StorageService
	) {
	}

	public isLoggedIn(): unknown {
		return this.getUser()?.isLoggedIn;
	}

	private getUser(): any {
		return this.storage.getSessionEntry('user');
	}
}
