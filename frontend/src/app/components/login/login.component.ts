import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { Permission } from 'src/app/enums/permission.enum';
import { DialogComponent } from '../dialog/dialog.component';
import { UserService } from 'src/app/services/user.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ErrorService } from 'src/app/services/error.service';
import { lastValueFrom } from 'rxjs';
import { ParserService } from 'src/app/services/parser.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	@ViewChild('inputUser') inputUser!: ElementRef;
	@ViewChild('submitLogin') submitLogin!: MatButton;

	public loginForm!: FormGroup;
	public hidePassword = true;
	public loading: boolean = false;

	constructor(
		private _snackbar: SnackbarService,
		private _storage: StorageService,
		private _router: Router,
		private _translate: TranslateService,
		private _api: ApiService,
		private _dialog: MatDialog,
		private _user: UserService,
		private _notifications: NotificationsService,
		private _error: ErrorService,
		private _parser: ParserService
	) {
		this._createForm();
	}

	ngOnInit(): void {
		this._user.user = this._storage.getSessionEntry('user');
		if (this._user?.['isLoggedIn'] && this._user?.['project'] !== '') {
			this._router.navigateByUrl('/');
		}
		setTimeout(() => this.inputUser.nativeElement.focus());
	}

	private _createForm(): void {
		this.loginForm = new FormGroup(
			{
				usernameFormControl: new FormControl('', { validators: [Validators.required] }),
				passwordFormControl: new FormControl('', { validators: [Validators.required] })
			}, { }
		);
	}

	private get _username(): string {
		return this.loginForm.get('usernameFormControl')?.value;
	}

	private get _password(): string {
		return this.loginForm.get('passwordFormControl')?.value;
	}

	private updateLanguage(): void {
		if (this._user.language) {
			this._translate.use(this._user.language);
		}
	}

	public async login(): Promise<void> {
		this.loading = true;
		try {
			const user = await lastValueFrom(this._api.login(this._username, await this._parser.sha256(this._password)));
			this.loading = false;
			this._storage.setSessionEntry('user', user);
			if (user.project === '') {
				this._dialog.open(CreateProjectComponent).afterClosed().subscribe((created) => {
					if (created) {
						this._notifications.init();
						this.updateLanguage();
						this._router.navigateByUrl('/');
					} else {
						this._storage.deleteSessionEntry('user');
					}
				});
			} else if (user.permission === Permission.INVITED) {
				const data = {
					headline: this._translate.instant('DIALOG.HEADLINE.INVITE'),
					description: this._translate.instant('DIALOG.INFO.INVITE', { project: user.project}),
					falseButton: this._translate.instant('APP.REJECT'),
					trueButton: this._translate.instant('APP.ACCEPT')
				};
				this._dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe(async (accept) => {
					try {
						const response = await lastValueFrom(this._api.handleInvite(user.token, accept));
						if(accept) {
							this._user.user = user
							try {
								const token = await lastValueFrom(this._api.refreshToken(this._user.token));
								this._user.token = token;
								this._user.permission = Permission.MEMBER;
								this._user.project = user.project;
								this._user.isLoggedIn = true;
								this._notifications.init();
								this._storage.setSessionEntry('user', this._user.user);
								this.updateLanguage();
								this._router.navigateByUrl('/');
							} catch (err) {
								this._error.handleApiError(err);
							}
						} else {
							this._storage.deleteSessionEntry('user');
						}
						this._snackbar.open(this._translate.instant(response.message));
					} catch (error) {
						this._error.handleApiError(error);
					}
				});
			} else {
				this._user.user = user;
				this._user.isLoggedIn = true;
				this._notifications.init();
				this._storage.setSessionEntry('user', this._user.user);
				this.updateLanguage();
				this._router.navigateByUrl('/');
			}
		} catch (loginError) {
			this.loading = false;
			this._error.handleApiError(loginError);
		}
	}

	public registration(): void {
		this._router.navigate(['/registration']);
	}

	public userValid(): boolean {
		return this.loginForm.controls['usernameFormControl'].valid;
	}

	public passwordValid(): boolean {
		return this.loginForm.controls['passwordFormControl'].valid;
	}
}
