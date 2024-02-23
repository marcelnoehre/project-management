import { Injectable } from '@angular/core';
import { RequestType } from '../enums/request-type.enum';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class RequestService {

	constructor(
		private _http: HttpClient
	) { }

	private _get<T>(url: string, data?: any): Observable<T> {
		return this._http.get<T>(this._adjustUrl(url, data));
	}

	private _post<T>(url: string, body: any): Observable<T> {
		return this._http.post<T>(url, body);
	}

	private _put<T>(url: string, body: any): Observable<T> {
		return this._http.put<T>(url, body);
	}

	private _delete<T>(url: string, data?: any): Observable<T> {
		return this._http.delete<T>(this._adjustUrl(url, data));
	}

	private _adjustUrl(url: string, data: any): string {
		let first = true;
		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				url += first ? '?' : '&';
				url += (key + '=' + data[key]);
				first = false;
			}
		}
		return url;
	}

	public send<T>(type: RequestType, url: string, data: any): Observable<T> {
		switch (type) {
			case RequestType.GET:
				return this._get<T>(url, data);
			case RequestType.POST:
				return this._post<T>(url, data);
			case RequestType.PUT:
				return this._put<T>(url, data);
			case RequestType.DELETE:
				return this._delete<T>(url, data);
			default:
				throw new Error('ERROR.REQUEST_TYPE');
		}
	}

}
