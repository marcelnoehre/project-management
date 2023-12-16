import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private basePath = 'http://localhost:3000/';
  private auth = 'auth/'

  constructor(private http: HttpClient) { }

  // ### AUTH ###
  public login(username: string, password: string): Observable<any> {
		return this.http.post<any>(this.basePath + this.auth + 'login', {username: username, password: password});
	}

}
