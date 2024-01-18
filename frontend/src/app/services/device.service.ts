import { Injectable } from '@angular/core';
import { NavigationEnd, Router, Event as RouterEvent } from '@angular/router';
import { filter, fromEvent, Observable, Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DeviceService {
	public width: number;
	public height: number;
	public resizeObservable$: Observable<Event>;
	public resizeSubscription$: Subscription;
	public activeRoute!: string;

	constructor(
		private router: Router
	) {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.resizeObservable$ = fromEvent(window, 'resize');
		this.resizeSubscription$ = this.resizeObservable$.subscribe(() => {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		});
	}

	public init() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
    this.router.events
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeRoute = event.urlAfterRedirects;
    });
	}

	public destroy() {
		this.resizeSubscription$.unsubscribe();
	}

  public getActiveRoute() {
    return this.activeRoute;
  }
}
