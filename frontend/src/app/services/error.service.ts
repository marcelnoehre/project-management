import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private _user: UserService,
    private _storage: StorageService,
    private _router: Router,
    private _snackbar: SnackbarService,
    private _translate: TranslateService
  ) { }

  public handleApiError(error: any) {
    if (error.status === 403) {
      this.handleInvalidUser();
    }
    this._snackbar.open(this._translate.instant(error.error.message));
    if (!error.error.message) {
      this._snackbar.open(error.statusText);
    }
  }

  public handleInvalidUser() {
    this._storage.clearSession();
    this._user.user = this._storage.getSessionEntry('user');
    this._router.navigateByUrl('/login');
  }
}
