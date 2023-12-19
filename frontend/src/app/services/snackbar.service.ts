import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarType } from '../enums/snackbar-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
	providedIn: 'root'
})
export class SnackbarService {
	constructor(
		private translate: TranslateService,
		public snackbar: MatSnackBar,
		private zone: NgZone
	) { }

	public open(message: string, action = this.translate.instant('APP.OK'), type: SnackbarType = SnackbarType.INFO, duration = 7000): void {
		this.zone.run(() => this.snackbar.open(message, action, { duration, panelClass: type }));
	}
}