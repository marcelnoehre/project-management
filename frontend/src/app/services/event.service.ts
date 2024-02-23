import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  public documentClick$ = new Subject<Element>();
  public updateFullName$ = new Subject<Element>();
  public updateInitials$ = new Subject<Element>();
  public updateColor$ = new Subject<Element>();
  public updateProfilePicture$ = new Subject<Element>();

}
