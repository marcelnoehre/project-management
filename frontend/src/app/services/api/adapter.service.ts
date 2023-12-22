import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from 'src/app/interfaces/data/task';
import { User } from 'src/app/interfaces/data/user';

@Injectable({
  providedIn: 'root'
})
export abstract class AdapterService {

  // ### AUTH ###
  public abstract login(username: string, password: string): Observable<User>;

  // ### TASK ###
  public abstract getTaskList(): Observable<Task[]>;

}
