import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from 'src/app/interfaces/state';
import { User } from 'src/app/interfaces/data/user';

@Injectable({
  providedIn: 'root'
})
export abstract class AdapterService {

  // ### AUTH ###
  public abstract login(username: string, password: string): Observable<User>;

  public abstract register(username: string, password: string, name: string, lang: string): Observable<Response>;


  // ### TASKS ###
  public abstract getTaskList(): Observable<State[]>;

}
