import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class EventService {

	public documentClick$ = new Subject<Element>();
	public updateFullName$ = new Subject<string>();
	public updateInitials$ = new Subject<string>();
	public updateColor$ = new Subject<string>();
	public updateProfilePicture$ = new Subject<string>();

}
