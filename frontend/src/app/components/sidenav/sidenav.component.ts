import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AppIcon } from 'src/app/enums/app-icon.enum';
import { AppItem } from 'src/app/enums/app-item.enum';
import { AppRoute } from 'src/app/enums/app-route.enum';
import { App } from 'src/app/interfaces/app';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
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
	clickEvent$!: Subscription;

	constructor(
		private storage: StorageService,
		private router: Router,
		private event: EventService
	) {
	}

	ngOnInit(): void {
		this.router.events
		.pipe(
			filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
		).subscribe((event: NavigationEnd) => {
			this.activeRoute = event.url;
		});
		this.clickEvent$ = this.event.documentClick$.subscribe((target) => {			
			if (this.isExpanded && !['mat-mdc-nav-list', 'mat-mdc-button-touch-target'].some(cls => target.classList.contains(cls))) this.toggleSidebar(false);
			if (!this.isExpanded && target.classList.contains('mat-mdc-nav-list')) this.toggleSidebar(true);
		});
	}

	ngOnDestroy(): void {
		this.clickEvent$.unsubscribe();
	}

	public isLoggedIn(): boolean {
		const user = this.storage.getSessionEntry('user');
		return user?.isLoggedIn;
	}

	isActive(route: string): string {
		return route === this.activeRoute  ? 'active-route' : '';
	}

	toggleSidebar(newState?: boolean) {
		this.isExpanded = newState !== undefined ? newState : !this.isExpanded;
	}

	public logout(): void {
		this.storage.deleteSessionEntry('user');
		this.router.navigateByUrl('/login')
	}
}
