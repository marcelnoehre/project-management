import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/interfaces/data/user';
import { Language } from 'src/app/interfaces/language';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { DialogComponent } from '../dialog/dialog.component';
import { UserService } from 'src/app/services/user.service';
import { ErrorService } from 'src/app/services/error.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  userSettingsForm!: FormGroup;
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
  initialUser: User = this.user.user;
  username!: string;
  fullName!: string;
  initials!: string;
  language!: string;
  password!: string;
  color!: string;
  hidePassword = true;
  profilePicture!: string;
  loadingDelete: boolean = false;
  loadingAttribute = {
    username: false,
    fullName: false,
    language: false,
    password: false,
    initials: false,
    color: false,
    profilePicture: false
  }

  constructor(
    private storage: StorageService,
    private api: ApiService,
    private router: Router,
    private snackbar: SnackbarService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private user: UserService,
    private _error: ErrorService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.username = this.initialUser.username;
    this.fullName = this.initialUser.fullName;
    this.initials = this.initialUser.initials;
    this.language = this.initialUser.language;
    this.color = this.initialUser.color;
    this.password = '';
    this.profilePicture = this.initialUser.profilePicture;
  }

  private createForm(): void {
    this.userSettingsForm = new FormGroup(
      {
        usernameFormControl: new FormControl('', {validators: [Validators.required] }),
        fullNameFormControl: new FormControl('', {validators: [Validators.required]}),
        languageFormControl: new FormControl('', {validators: []}),
        passwordFormControl: new FormControl('', { validators: [Validators.required] }),
        initialsFormControl: new FormControl('', {validators: [Validators.required]}),
        colorFormControl: new FormControl('', {validators: []}),
        profilePictureFormControl: new FormControl('', {validators: []})
      },
      { }
    );
    
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      if(file.type.startsWith("image/")) {
        const reader = new FileReader;
        reader.onload = (e) => {
            this.profilePicture = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeFile() {
    this.profilePicture = '';
  }

  updateUser(attribute: string, value: string) {
    const key = this.translate.instant('USER.' + attribute.toUpperCase());
    const data = {
      headline: this.translate.instant('DIALOG.HEADLINE.CHANGE_ATTRIBUTE', { attribute: key}),
      description: this.translate.instant('DIALOG.INFO.CHANGE_ATTRIBUTE', { attribute: key}),
      falseButton: this.translate.instant('APP.CANCEL'),
      trueButton: this.translate.instant('APP.CONFIRM')
    };
    this.dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe(
      async (confirmed) => {
        if (confirmed) {
          if (attribute === 'password') value = await this.sha256(value);
          (this.loadingAttribute as any)[attribute] = true;          
          this.api.updateUser(this.user.token, attribute, value).subscribe(
            (response) => {
              (this.loadingAttribute as any)[attribute] = false;
              this.snackbar.open(this.translate.instant(response.message));
              this.user.update(attribute, value);
              this.initialUser = this.user.user;
              this.storage.setSessionEntry('user', this.user.user);
              if (attribute === 'password') {
                this.password = '';
              } else if (attribute === 'language') {
                this.translate.use(value);
              }
            },
            (error) => {
              (this.loadingAttribute as any)[attribute] = false;
              this._error.handleApiError(error);
            }
          );
        }
      }
    );
  }

  async deleteUser() {
    const data = {
      headline: this.translate.instant('DIALOG.HEADLINE.DELETE_ACCOUNT'),
      description: this.translate.instant('DIALOG.INFO.DELETE_ACCOUNT'),
      falseButton: this.translate.instant('APP.CANCEL'),
      trueButton: this.translate.instant('APP.CONFIRM')
    };
    this.dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe(
      async (confirmed) => {
        if (confirmed) {
          this.loadingDelete = true;
          this.api.deleteUser(this.user.token).subscribe(
            (response) => {
              this.loadingDelete = false;
              this.storage.clearSession();
              this.user.user = this.storage.getSessionEntry('user');
              this.router.navigateByUrl('/login');
              this.snackbar.open(this.translate.instant(response.message));
            },
            (error) => {
              this.loadingDelete = false;
              this._error.handleApiError(error);
            }
          );
        }
      }
    );
  }

  public hasError(formControl: string, type: string): boolean {
    return this.userSettingsForm.controls[formControl].hasError(type);
  }

  isDisabled(attribute: string, value: string) {
    if (attribute === 'profilePicture') return this.initialUser[attribute] === value;
    return this.initialUser[attribute] === value || value === '' || value === null;
  }

  hasProfilePicture() {
    return this.profilePicture !== '';
  }

  async sha256(message: string): Promise<string> {
		const encoder = new TextEncoder();
		const data = encoder.encode(message);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
		return hashHex;
	}

  isLoading(attribute: string): boolean {
    return (this.loadingAttribute as any)[attribute]
  }
}
