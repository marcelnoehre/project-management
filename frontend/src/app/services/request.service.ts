import { Injectable } from '@angular/core';
import { RequestType } from '../enums/request-type.enum';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor() { }

  public send(url: string, type: RequestType, data?: any): any {
    switch(type) {
      case RequestType.GET:
        return this.get(url, data);
      case RequestType.POST:
        return this.post(url, data);
      case RequestType.PUT:
        return this.put(url, data);
      case RequestType.DELETE:
        return this.delete(url, data);
      default:
        throw new Error('ERROR.REQUEST_TYPE');
    }
  }

  private get(url: string, data?: any) {
    
  }

  private post(url: string, data?: any) {

  }

  private put(url: string, data?: any) {

  }

  private delete(url: string, data?: any) {

  }

}
