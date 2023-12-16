import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  @ViewChild('inputUser') inputUser!: ElementRef;
  @ViewChild('submitRegistration') submitLogin!: MatButton;

  hidePassword = true;
  hidePasswordRepeat = true;
  registrationForm!: FormGroup;

  constructor(
    private router: Router,
    private _storage: StorageService
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
    this.registrationForm = new FormGroup(
      {
        usernameFormControl: new FormControl('', {validators: [Validators.required] }),
        passwordFormControl: new FormControl('', { validators: [Validators.required] }), 
        passwordRepeatFormControl: new FormControl('', { validators: [Validators.required] })
      },
      {}
    );
  }

  get user(): Record<string, unknown> {
		return this._storage.getSessionEntry('user');
	}

	get username(): string {
		return this.registrationForm.get('usernameFormControl')?.value;
	}

	get password(): string {
		return this.registrationForm.get('passwordFormControl')?.value;
	}

  get passwordRepeat(): string {
		return this.registrationForm.get('passwordRepeatFormControl')?.value;
	}

  public userValid(): boolean {
		return this.registrationForm.controls['usernameFormControl'].valid;
	}

	public passwordValid(): boolean {
		return this.registrationForm.controls['passwordFormControl'].valid;
	}

  public passwordRepeatValid(): boolean {
		return this.registrationForm.controls['passwordRepeatFormControl'].valid;
	}

  register() {
    throw new Error('Method not implemented!');
  }

  login() {
    this.router.navigateByUrl('/login');
  }
}
