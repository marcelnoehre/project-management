import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/data/user';
import { Language } from 'src/app/interfaces/language';
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
  fullname!: string;
  initials!: string;
  language!: string;
  password!: string;
  hidePassword = true;

  constructor(private storage: StorageService) {

  }

  ngOnInit(): void {
    this.username = this.initialUser.username;
    this.fullname = this.initialUser.fullName;
    this.initials = this.initialUser.initials;
    this.language = this.initialUser.language;
    this.password = '';
  }

  private getUser(): any {
		return this.storage.getSessionEntry('user');
	}

}
