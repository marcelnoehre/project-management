import { Injectable } from '@angular/core';
import { AdapterService } from './adapter.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interfaces/data/user';

@Injectable({
  providedIn: 'root'
})
export class MockService extends AdapterService {

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  private availableMockData = {
		validUsers: ['admin'],
	};

  // ### AUTH ###
  public override login(username: string, password: string): Observable<User> {
    if (this.availableMockData.validUsers.includes(username) && password === '1234') {
			return this.http.get<User>(`assets/mock-data/auth/login/${username}.json`);
		} else {
			throw new Error('Wrong credentials');
		}
  }
}