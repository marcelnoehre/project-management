import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/interfaces/data/user';
import { Language } from 'src/app/interfaces/language';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';

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
    private translate: TranslateService
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

    console.log(attribute, value);
  }

  isDisabled(attribute: string, value: string) {
    return this.initialUser[attribute] === value || value === '' || value === null;
  }

  hasProfilePicture() {
    return this.profilePicture !== '';
  }
}
