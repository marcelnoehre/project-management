import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/interfaces/language';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
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
    private storage: StorageService,
    private snackbar: SnackbarService,
    private translate: TranslateService,
    private api: ApiService
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
		return this.storage.getSessionEntry('user');
	}

	get username(): string {
		return this.registrationForm.get('usernameFormControl')?.value;
	}
  
  get fullName(): string {
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

  async register() {
    if (this.password !== this.passwordRepeat) {
      this.snackbar.open(this.translate.instant('REGISTRATION.PASSWORDS_DONT_MATCH'));
    } else {
      const hashedPassword = await this.sha256(this.password);
      const fullNameArr = this.fullName.split(/\s+/);
      const initials = fullNameArr[0].charAt(0) + (fullNameArr.length > 1 ? fullNameArr[1]?.charAt(0) : '');
      this.api.register(this.username, hashedPassword, this.fullName, this.language, initials).subscribe(
        (response) => {
          this.snackbar.open(this.translate.instant(response.message));
          this.router.navigateByUrl('/login');
        },
        (error) => {
          this.snackbar.open(this.translate.instant(error.error.message));
        }
      );
    }
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
