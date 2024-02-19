import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, Event as RouterEvent } from '@angular/router';
import { filter, fromEvent, Observable, Subscription } from 'rxjs';
import { Viewport } from '../enums/viewport.enum';

@Injectable({
	providedIn: 'root'
})
export class DeviceService implements OnDestroy {
	private _width: number;
	private _activeRoute: string = '/';
	private _resizeSubscription$: Subscription;
	private _resizeObservable$: Observable<Event>;

	constructor(
		private _router: Router
	) {
		this._width = window.innerWidth;
		this._resizeObservable$ = fromEvent(window, 'resize');
		this._resizeSubscription$ = this._resizeObservable$.subscribe(() => {
			this._width = window.innerWidth;
		});
	}

	ngOnDestroy(): void {
		this._resizeSubscription$.unsubscribe();
	}

	public init(): void {
		this._width = window.innerWidth;
		this._router.events
			.pipe(
				filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
			)
			.subscribe((event: NavigationEnd) => {
				this._activeRoute = event.urlAfterRedirects;
			}
		);
	}

	public get activeRoute(): string {
		return this._activeRoute;
	}

	public isSmallScreen(): boolean {
		return this._width < Viewport.MD;
	}
}
