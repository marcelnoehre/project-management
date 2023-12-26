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

	constructor(
		private snackbar: SnackbarService,
		private storage: StorageService,
		private router: Router,
		private translate: TranslateService,
		private api: ApiService,
		private dialog: MatDialog
	) {
		this.createForm();
	}

	ngOnInit(): void {
		if (this.user?.['isLoggedIn']) {
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

	get user(): Record<string, unknown> {
		return this.storage.getSessionEntry('user');
	}

	get username(): string {
		return this.loginForm.get('usernameFormControl')?.value;
	}

	get password(): string {
		return this.loginForm.get('passwordFormControl')?.value;
	}

	public async login(): Promise<void> {
		const hashedPassword = await this.sha256(this.password);
		this.api.login(this.username, hashedPassword).subscribe(
			(user) => {
				if (user?.isLoggedIn) {
					this.storage.setSessionEntry('user', user);
					if (user.project === '') {
						this.dialog.open(CreateProjectComponent).afterClosed().subscribe((created) => {
							if (!created) {
								this.storage.deleteSessionEntry('user');
							}
						});
					} else {
						this.router.navigateByUrl('/');
					}
					
				}
			},
			(error) => {
				this.snackbar.open(this.translate.instant(error.error.message));
			}
		);
	}

	public userValid(): boolean {
		return this.loginForm.controls['usernameFormControl'].valid;
	}

	public passwordValid(): boolean {
		return this.loginForm.controls['passwordFormControl'].valid;
	}

	public forgotPassword(): void {
		throw new Error('Method not implemented!');
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