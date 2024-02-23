import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarType } from '../enums/snackbar-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
	providedIn: 'root'
})
export class SnackbarService {
	constructor(
		private _zone: NgZone,
		private _snackbar: MatSnackBar,
		private _translate: TranslateService
	) { }

	public open(message: string, action = this._translate.instant('APP.OK'), type: SnackbarType = SnackbarType.INFO, duration = 7000): void {
		this._zone.run(() => this._snackbar.open(message, action, { duration, panelClass: type }));
	}
}