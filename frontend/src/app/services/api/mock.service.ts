import { Injectable } from '@angular/core';
import { AdapterService } from './adapter.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockService extends AdapterService {

  constructor() {
    super();
  }

  // ### AUTH ###
  public override login(username: string, password: string): Observable<any> {
    throw new Error('Method not implemented.');
  }
}