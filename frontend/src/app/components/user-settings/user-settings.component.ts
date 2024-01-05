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

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
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
  initialUser: User = this.getUser();
  username!: string;
  fullName!: string;
  initials!: string;
  language!: string;
  password!: string;
  hidePassword = true;
  profilePicture!: string;

  constructor(
    private storage: StorageService,
    private api: ApiService,
    private router: Router,
    private snackbar: SnackbarService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.username = this.initialUser.username;
    this.fullName = this.initialUser.fullName;
    this.initials = this.initialUser.initials;
    this.language = this.initialUser.language;
    this.password = '';
    this.profilePicture = this.initialUser.profilePicture;
  }

  private getUser(): any {
		return this.storage.getSessionEntry('user');
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
    this.api.updateUser(this.getUser().token, this.getUser().username, attribute, value).subscribe(
      (response) => {
        this.snackbar.open(this.translate.instant(response.message));
        let user = this.getUser();
        user[attribute] = value;
        this.initialUser = user;
        this.storage.setSessionEntry('user', user);
      },
      (error) => {
        if (error.status === 403) {
          this.storage.clearSession();
          this.router.navigateByUrl('/login');
        }
        this.snackbar.open(this.translate.instant(error.error.message));
      }
    );
  }

  async updatePassword() {
    const data = {
      headline: this.translate.instant('REGISTRATION.CHANGE_PASSWORD_HEADLINE'),
      description: this.translate.instant('REGISTRATION.CHANGE_PASSWORD_INFO'),
      falseButton: this.translate.instant('APP.CANCEL'),
      trueButton: this.translate.instant('APP.CONFIRM')
    };
    this.dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe(
      async (confirmed) => {
        if (confirmed) {
          const hashedPassword = await this.sha256(this.password);
          this.updateUser('password', hashedPassword);
        }
      }
    );
  }

  async deleteUser() {
    const data = {
      headline: this.translate.instant('REGISTRATION.DELETE_USER'),
      description: this.translate.instant('REGISTRATION.DELETE_USER_INFO'),
      falseButton: this.translate.instant('APP.CANCEL'),
      trueButton: this.translate.instant('APP.CONFIRM')
    };
    this.dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe(
      async (confirmed) => {
        if (confirmed) {
          this.api.deleteUser(this.getUser().token, this.getUser().username).subscribe(
            (response) => {
              this.storage.clearSession();
              this.router.navigateByUrl('/login');
              this.snackbar.open(this.translate.instant(response.message));
            },
            (error) => {
              if (error.status === 403) {
                this.storage.clearSession();
                this.router.navigateByUrl('/login');
              }
              this.snackbar.open(this.translate.instant(error.error.message));
            }
          );
        }
      }
    );
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
}
