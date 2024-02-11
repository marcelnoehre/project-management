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
		private snackbar: SnackbarService,
		private storage: StorageService,
		private router: Router,
		private translate: TranslateService,
		private api: ApiService,
		private dialog: MatDialog,
		private user: UserService,
		private notifications: NotificationsService,
		private _error: ErrorService
	) {
		this.createForm();
	}

	ngOnInit(): void {
		this.user.user = this.storage.getSessionEntry('user');
		if (this.user?.['isLoggedIn'] && this.user?.['project'] !== '') {
			this.router.navigateByUrl('/');
		}
		setTimeout(() => this.inputUser.nativeElement.focus());
	}

	private createForm(): void {
		this.loginForm = new FormGroup(
			{
				usernameFormControl: new FormControl('', { validators: [Validators.required] }),
				passwordFormControl: new FormControl('', { validators: [Validators.required] })
			},
			{}
		);
	}

	get username(): string {
		return this.loginForm.get('usernameFormControl')?.value;
	}

	get password(): string {
		return this.loginForm.get('passwordFormControl')?.value;
	}

	public async login(): Promise<void> {
		const hashedPassword = await this.sha256(this.password);
		this.loading = true;
		this.api.login(this.username, hashedPassword).subscribe(
			(user) => {
				this.loading = false;
				this.storage.setSessionEntry('user', user);
				if (user.project === '') {
					this.dialog.open(CreateProjectComponent).afterClosed().subscribe((created) => {
						if (created) {
							this.notifications.init();
							this.updateLanguage();
							this.router.navigateByUrl('/');
						} else {
							this.storage.deleteSessionEntry('user');
						}
					});
				} else if (user.permission === Permission.INVITED) {
					const data = {
						headline: this.translate.instant('DIALOG.HEADLINE.INVITE'),
						description: this.translate.instant('DIALOG.INFO.INVITE', { project: user.project}),
						falseButton: this.translate.instant('APP.REJECT'),
						trueButton: this.translate.instant('APP.ACCEPT')
					};
					this.dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe((accept) => {
						this.api.handleInvite(user.token, accept).subscribe(
							(response) => {
								if(accept) {
									this.user.user = user
									this.user.permission = Permission.MEMBER;
									this.user.project = user.project;
									this.user.isLoggedIn = true;
									this.notifications.init();
									this.storage.setSessionEntry('user', this.user.user);
									this.updateLanguage();
									this.router.navigateByUrl('/');
								} else {
									this.storage.deleteSessionEntry('user');
								}
								this.snackbar.open(this.translate.instant(response.message));
							},
							(error) => {
								this._error.handleApiError(error);
							}
						)
					});
				} else {
					this.user.user = user;
					this.user.isLoggedIn = true;
					this.notifications.init();
					this.storage.setSessionEntry('user', this.user.user);
					this.updateLanguage();
					this.router.navigateByUrl('/');
				}
			},
			(error) => {
				this.loading = false;
				this._error.handleApiError(error);
			}
		);
	}

	public userValid(): boolean {
		return this.loginForm.controls['usernameFormControl'].valid;
	}

	public passwordValid(): boolean {
		return this.loginForm.controls['passwordFormControl'].valid;
	}

	public updateLanguage(): void {
		if (this.user.language) {
			this.translate.use(this.user.language);
		}
	}

	public registration(): void {
		this.router.navigate(['/registration']);
	}

	async sha256(message: string): Promise<string> {
		const encoder = new TextEncoder();
		const data = encoder.encode(message);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
		return hashHex;
	}
}