import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppIcon } from 'src/app/enums/app-icon.enum';
import { AppItem } from 'src/app/enums/app-item.enum';
import { AppRoute } from 'src/app/enums/app-route.enum';
import { App } from 'src/app/interfaces/app';
import { ApiService } from 'src/app/services/api/api.service';
import { DeviceService } from 'src/app/services/device.service';
import { ErrorService } from 'src/app/services/error.service';
import { EventService } from 'src/app/services/event.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
	@ViewChild('sidenav', { static: false }) sidenav!: MatSidenav;

	public isExpanded = false;

	public appItems: App[] = [
		{
			name: AppItem.Dashboard,
			route: AppRoute.Dashboard,
			icon: AppIcon.Dashboard
		},
		{
			name: AppItem.CreateTask,
			route: AppRoute.CreateTask,
			icon: AppIcon.CreateTask
		},
		{
			name: AppItem.Board,
			route: AppRoute.Board,
			icon: AppIcon.Board
		},
		{
			name: AppItem.ImportTasks,
			route: AppRoute.ImportTasks,
			icon: AppIcon.ImportTasks
		},
		{
			name: AppItem.TrashBin,
			route: AppRoute.TrashBin,
			icon: AppIcon.TrashBin
		},
		{
			name: AppItem.Stats,
			route: AppRoute.Stats,
			icon: AppIcon.Stats
		}
	]
	clickEvent$!: Subscription;

	constructor(
		private storage: StorageService,
		private router: Router,
		private event: EventService,
		private api: ApiService,
		private snackbar: SnackbarService,
		private translate: TranslateService,
		private user: UserService,
		private device: DeviceService,
		private notifications: NotificationsService,
		private _error: ErrorService
	) {
	}

	ngOnInit(): void {
		this.user.user = this.storage.getSessionEntry('user');
		if (this.isLoggedIn()) {
			this.api.verify(this.user.token, this.user.username).subscribe(
				(user) => {
					this.storage.setSessionEntry('user', user);
					this.user.user = user;
					this.user.isLoggedIn = true;
					this.notifications.init();
				},
				(error) => {
					this._error.handleApiError(error);
				}
			);
		}
		this.clickEvent$ = this.event.documentClick$.subscribe((target) => {			
			if (this.isExpanded && !['mat-mdc-nav-list', 'mat-mdc-button-touch-target'].some(cls => target.classList.contains(cls))) this.toggleSidebar(false);
			if (!this.isExpanded && target.classList.contains('mat-mdc-nav-list')) this.toggleSidebar(true);
		});
	}

	ngOnDestroy(): void {
		this.clickEvent$.unsubscribe();
	}

	isLoggedIn() {
		return this.user.isLoggedIn && this.user.project !== '';
	}

	isActive(route: string): string {
		return route === this.device.getActiveRoute()  ? 'active-route' : '';
	}

	toggleSidebar(newState?: boolean) {
		this.isExpanded = newState !== undefined ? newState : !this.isExpanded;
	}

	hideSidenav(): boolean {
		return this.device.activeRoute === '/';
	}

	sidenavSize() {
		if (this.device.isSmallScreen()) {
			return this.isExpanded ? 'w-100' : 'hide-sidenav';
		} else {
			return '';
		}	
	}

	showBackground() {
		return this.device.getActiveRoute() === '/login' || this.device.getActiveRoute() === '/registration';
	}
}
