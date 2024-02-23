import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription, lastValueFrom } from 'rxjs';
import { AppIcon } from 'src/app/enums/app-icon.enum';
import { AppItem } from 'src/app/enums/app-item.enum';
import { AppRoute } from 'src/app/enums/app-route.enum';
import { App } from 'src/app/interfaces/app';
import { ApiService } from 'src/app/services/api/api.service';
import { DeviceService } from 'src/app/services/device.service';
import { ErrorService } from 'src/app/services/error.service';
import { EventService } from 'src/app/services/event.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
	@ViewChild('sidenav', { static: false }) sidenav!: MatSidenav;
	
	private _clickEvent$!: Subscription;
	public isExpanded = false;
	public appItems: App[] = [
		{
			name: AppItem.DASHBOARD,
			route: AppRoute.DASHBOARD,
			icon: AppIcon.DASHBOARD
		},
		{
			name: AppItem.CREATE_TASK,
			route: AppRoute.CREATE_TASK,
			icon: AppIcon.CREATE_TASK
		},
		{
			name: AppItem.BOARD,
			route: AppRoute.BOARD,
			icon: AppIcon.BOARD
		},
		{
			name: AppItem.IMPORT_TASKS,
			route: AppRoute.IMPORT_TASKS,
			icon: AppIcon.IMPORT_TASKS
		},
		{
			name: AppItem.TRASH_BIN,
			route: AppRoute.TRASH_BIN,
			icon: AppIcon.TRASH_BIN
		},
		{
			name: AppItem.STATS,
			route: AppRoute.STATS,
			icon: AppIcon.STATS
		}
	];

	constructor(
		private _storage: StorageService,
		private _event: EventService,
		private _api: ApiService,
		private _user: UserService,
		private _device: DeviceService,
		private _notifications: NotificationsService,
		private _error: ErrorService
	) {
	}

	async ngOnInit(): Promise<void> {
		this._user.user = this._storage.getSessionEntry('user');
		if (this.isLoggedIn()) {
			try {
				const user = await lastValueFrom(this._api.verify(this._user.token));
				this._storage.setSessionEntry('user', user);
				this._user.user = user;
				this._user.isLoggedIn = true;
				this._notifications.init();
			} catch (error) {
				this._error.handleApiError(error);
			}
		}
		this._clickEvent$ = this._event.documentClick$.subscribe((target) => {			
			if (this.isExpanded && !['mat-mdc-nav-list', 'mat-mdc-button-touch-target'].some(cls => target.classList.contains(cls))) this.toggleSidebar(false);
			if (!this.isExpanded && target.classList.contains('mat-mdc-nav-list')) this.toggleSidebar(true);
		});
	}

	ngOnDestroy(): void {
		if (this._clickEvent$) this._clickEvent$.unsubscribe();
	}

	public toggleSidebar(newState?: boolean): void {
		this.isExpanded = newState !== undefined ? newState : !this.isExpanded;
	}

	public hideSidenav(): boolean {
		return this._device.activeRoute === '/';
	}

	public sidenavSize(): string {
		if (this._device.isSmallScreen()) {
			return this.isExpanded ? 'w-100' : 'hide-sidenav';
		} else {
			return '';
		}	
	}

	public isLoggedIn(): boolean {
		return this._user.isLoggedIn && this._user.project !== '';
	}

	public isActive(route: string): string {
		return route === this._device.activeRoute  ? 'active-route' : '';
	}

	public showBackground(): boolean {
		return this._device.activeRoute === '/login' || this._device.activeRoute === '/registration';
	}
}
