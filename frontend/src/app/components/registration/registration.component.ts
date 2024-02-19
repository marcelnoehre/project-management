import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { ApiService } from 'src/app/services/api/api.service';
import { ErrorService } from 'src/app/services/error.service';
import { ParserService } from 'src/app/services/parser.service';
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
  
  public registrationForm!: FormGroup;
  public hidePassword = true;
  public hidePasswordRepeat = true;
  public loading: boolean = false;
  public languages: Language[] = [
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
    private _router: Router,
    private _storage: StorageService,
    private _snackbar: SnackbarService,
    private _translate: TranslateService,
    private _api: ApiService,
    private _user: UserService,
    private _error: ErrorService,
    private _parser: ParserService
    ) {
      this._createForm();
    }

  ngOnInit(): void {
    this._user.user = this._storage.getSessionEntry('user');
    if (this._user.isLoggedIn) {
			this._router.navigateByUrl('/');
		}
		setTimeout(() => this.inputUser.nativeElement.focus());
  }

  private _createForm(): void {
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

	private get _username(): string {
		return this.registrationForm.get('usernameFormControl')?.value;
	}
  
  private get _fullName(): string {
    return this.registrationForm.get('fullnameFormControl')?.value;
  }

  private get _language(): string {
    return this.registrationForm.get('languageFormControl')?.value;
  }

	private get _password(): string {
		return this.registrationForm.get('passwordFormControl')?.value;
	}

  private get _passwordRepeat(): string {
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

  public passwordInformation(): string {
    return this._translate.instant('REGISTRATION.PASSWORD_FORMAT');
  }

  public async register(): Promise<void> {
    if (this._password !== this._passwordRepeat) {
      this._snackbar.open(this._translate.instant('ERROR.PASSWORDS_MATCH'));
    } else {
      try {
        this.loading = true;
        const response = await lastValueFrom(this._api.register(this._username, this._fullName, this._language, await this._parser.sha256(this._password)));
        this.loading = false;
        this._snackbar.open(this._translate.instant(response.message));
        this._router.navigateByUrl('/login');
      } catch (error) {
        this.loading = false;
        this._error.handleApiError(error);
      }
    }
  }

  public login(): void {
    this._router.navigateByUrl('/login');
  }
}
