import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AppIcon } from 'src/app/enums/app-icon.enum';
import { AppItem } from 'src/app/enums/app-item.enum';
import { AppRoute } from 'src/app/enums/app-route.enum';
import { App } from 'src/app/interfaces/app';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  @ViewChild('sidenav', { static: false }) sidenav!: MatSidenav;

	public activeRoute!: string;
	public isExpanded = false;

  public appItems: App[] = [
    {
			name: AppItem.Dashboard,
			route: AppRoute.Dashboard,
			icon: AppIcon.Dashboard
		},
  ]

	constructor(
		private storage: StorageService,
		private router: Router
	) {
	}

	public isLoggedIn(): boolean {
		const user = this.storage.getSessionEntry('user');
		return user?.isLoggedIn;
	}

	private getUser(): any {
		return this.storage.getSessionEntry('user');
	}

	isActive(route: string): string {
		return route === this.activeRoute  ? 'active-route' : '';
	}

	toggleSidebar(newState?: boolean) {
		this.isExpanded = newState !== undefined ? newState : !this.isExpanded;
	}

	public logout(): void {
    throw new Error('Method not implemented!');
	}
}
