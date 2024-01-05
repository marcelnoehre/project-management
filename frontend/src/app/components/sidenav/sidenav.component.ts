import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router, Event } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, filter } from 'rxjs';
import { AppIcon } from 'src/app/enums/app-icon.enum';
import { AppItem } from 'src/app/enums/app-item.enum';
import { AppRoute } from 'src/app/enums/app-route.enum';
import { App } from 'src/app/interfaces/app';
import { ApiService } from 'src/app/services/api/api.service';
import { EventService } from 'src/app/services/event.service';
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

	public activeRoute!: string;
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
			name: AppItem.KanBan,
			route: AppRoute.KanBan,
			icon: AppIcon.KanBan
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
		private user: UserService
	) {
	}

	ngOnInit(): void {
		this.user.user = this.storage.getSessionEntry('user');
		if (this.isLoggedIn()) {
			this.api.verify(this.user.token, this.user.username).subscribe(
				(user) => {
					this.storage.setSessionEntry('user', user);
					this.user.user = user;
					this.user.isLoggedIn = 'true';
				},
				(error) => {
					if (error.status === 403) {
						this.storage.clearSession();
						this.user.user = this.storage.getSessionEntry('user');
						this.router.navigateByUrl('/login');
					}
					this.snackbar.open(this.translate.instant(error.error.message));
				}
			);
		}
		this.router.events
		.pipe(
			filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
		).subscribe((event: NavigationEnd) => {
			this.activeRoute = event.urlAfterRedirects;
		});
		this.clickEvent$ = this.event.documentClick$.subscribe((target) => {			
			if (this.isExpanded && !['mat-mdc-nav-list', 'mat-mdc-button-touch-target'].some(cls => target.classList.contains(cls))) this.toggleSidebar(false);
			if (!this.isExpanded && target.classList.contains('mat-mdc-nav-list')) this.toggleSidebar(true);
		});
	}

	ngOnDestroy(): void {
		this.clickEvent$.unsubscribe();
	}

	isLoggedIn() {
		return this.user.isLoggedIn === 'true' && this.user.project !== '';
	}

	isActive(route: string): string {
		return route === this.activeRoute  ? 'active-route' : '';
	}

	toggleSidebar(newState?: boolean) {
		this.isExpanded = newState !== undefined ? newState : !this.isExpanded;
	}

	showBackground() {
		return this.activeRoute === '/login' || this.activeRoute === '/registration';
	}
}
