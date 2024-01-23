import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  public documentClick$ = new Subject<Element>();

  public loading$ = new Subject<boolean>();

  public startLoading(): void {
	  this.loading$.next(true);
	}

	public stopLoading(): void {
		this.loading$.next(false);
	}

}
