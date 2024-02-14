import { Injectable } from '@angular/core';
import { RequestType } from '../enums/request-type.enum';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private http: HttpClient
  ) { }

  public send<T>(type: RequestType, url: string, data: any): Observable<T> {
    switch(type) {
      case RequestType.GET:
        return this.get<T>(url, data);
      case RequestType.POST:
        return this.post<T>(url, data);
      // case RequestType.PUT:
      //   return this.put<T>(url, data);
      // case RequestType.DELETE:
      //   return this.delete<T>(url, data);
      default:
        throw new Error('ERROR.REQUEST_TYPE');
    }
  }

  private get<T>(url: string, data?: any): Observable<T> {
    let first: boolean = true;
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        url += first ? '?' : '&';
        url += (key + '=' + data[key]);
      }
    }
    return this.http.get<T>(url);
  }

  private post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
  }

  // private put<T>(url: string, data?: any): Observable<T> {

  // }

  // private delete<T>(url: string, data?: any): Observable<T> {

  // }

}
