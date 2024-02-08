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
    private user: UserService,
    private storage: StorageService,
    private router: Router,
    private snackbar: SnackbarService,
    private translate: TranslateService
  ) { }

  handleApiError(error: any) {
    if (error.status === 403) {
      this.handleInvalidUser();
    }
    this.snackbar.open(this.translate.instant(error.error.message));
    if (!error.error.message) {
      this.snackbar.open(error.statusText);
    }
  }

  handleInvalidUser() {
    this.storage.clearSession();
    this.user.user = this.storage.getSessionEntry('user');
    this.router.navigateByUrl('/login');
  }
}
