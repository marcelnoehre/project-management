import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
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
  profilePicture!: SafeUrl | null;

  constructor(private storage: StorageService) {

  }

  ngOnInit(): void {
    this.username = this.initialUser.username;
    this.fullname = this.initialUser.fullName;
    this.initials = this.initialUser.initials;
    this.language = this.initialUser.language;
    this.password = '';
    this.profilePicture = null;
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
    this.profilePicture = null;
  }

}
