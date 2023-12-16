import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class AdapterService {

  // ### AUTH ###
  public abstract login(username: string, password: string): Observable<any>;

}
