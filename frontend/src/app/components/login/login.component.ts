import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

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
		private storage: StorageService,
		private router: Router,
	) {
		this.createForm();
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

	ngOnInit(): void {
    if (this.user?.['isLoggedIn']) {
      this.router.navigateByUrl('/');
    }
		setTimeout(() => this.inputUser.nativeElement.focus());
	}

	public login(): void {
    throw new Error('Method not implemented!');
  }

	public userValid(): boolean {
		return this.loginForm.controls['usernameFormControl'].valid;
	}

	public passwordValid(): boolean {
		return this.loginForm.controls['passwordFormControl'].valid;
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
}