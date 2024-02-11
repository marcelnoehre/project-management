import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/interfaces/language';
import { ApiService } from 'src/app/services/api/api.service';
import { ErrorService } from 'src/app/services/error.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

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
  loading: boolean = false;
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
    private api: ApiService,
    private user: UserService,
    private _error: ErrorService
    ) {
      this.createForm();
    }

  ngOnInit(): void {
    this.user.user = this.storage.getSessionEntry('user');
    if (this.user.isLoggedIn) {
      //TODO: verify
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

  public hasError(formControl: string, type: string): boolean {
    return this.registrationForm.controls[formControl].hasError(type);
  }

  passwordInformation(): string {
    return this.translate.instant('REGISTRATION.PASSWORD_FORMAT');
  }

  async register() {
    if (this.password !== this.passwordRepeat) {
      this.snackbar.open(this.translate.instant('ERROR.PASSWORDS_MATCH'));
    } else {
      this.loading = true;
      const hashedPassword = await this.sha256(this.password);
      this.api.register(this.username, this.fullName, this.language, hashedPassword).subscribe(
        (response) => {
          this.loading = false;
          this.snackbar.open(this.translate.instant(response.message));
          this.router.navigateByUrl('/login');
        },
        (error) => {
          this.loading = false;
          this._error.handleApiError(error);
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
