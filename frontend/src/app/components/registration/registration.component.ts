import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { Language } from 'src/app/interfaces/language';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  @ViewChild('inputUser') inputUser!: ElementRef;
  @ViewChild('submitRegistration') submitLogin!: MatButton;

  hidePassword = true;
  hidePasswordRepeat = true;
  registrationForm!: FormGroup;
  languages: Language[] = [
    {
      key: 'en',
      label: 'English'
    },
    {
      key: 'de',
      label: 'Deutsch'
    }
  ];

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
        fullnameFormControl: new FormControl('', {validators: [Validators.required]}),
        languageFormControl: new FormControl('', {validators: []}),
        passwordFormControl: new FormControl('', { validators: [Validators.required] }),
        passwordRepeatFormControl: new FormControl('', { validators: [Validators.required] })
      },
      { }
    );
  }

  get user(): Record<string, unknown> {
		return this._storage.getSessionEntry('user');
	}

	get username(): string {
		return this.registrationForm.get('usernameFormControl')?.value;
	}
  
  get fullname(): string {
    return this.registrationForm.get('fullnameFormControl')?.value;
  }

  get language(): string {
    return this.registrationForm.get('languageFormControl')?.value;
  }

	get password(): string {
		return this.registrationForm.get('passwordFormControl')?.value;
	}

  get passwordRepeat(): string {
		return this.registrationForm.get('passwordRepeatFormControl')?.value;
	}

  public usernameValid(): boolean {
		return this.registrationForm.controls['usernameFormControl'].valid;
	}

  public fullnameValid(): boolean {
    return this.registrationForm.controls['fullnameFormControl'].valid;
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

  async sha256(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
}
