import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/data/user';

@Injectable({
  providedIn: 'root'
})
export abstract class AdapterService {

  // ### AUTH ###
  public abstract login(username: string, password: string): Observable<User>;

}
