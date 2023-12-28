import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Permission } from 'src/app/enums/permission.enum';
import { User } from 'src/app/interfaces/data/user';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { DialogComponent } from '../dialog/dialog.component';
import { Language } from 'src/app/interfaces/language';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  inviteForm!: FormGroup;
  members: User[] = [];
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
    private api: ApiService,
    private storage: StorageService,
    private snackbar: SnackbarService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.api.getTeamMembers(this.getUser().token, this.getUser().project).subscribe(
      (users) => {
        this.members = users.sort((a, b) => {
          if (a.permission === Permission.OWNER && b.permission !== Permission.OWNER) {
            return -1;
          } else if (b.permission === Permission.OWNER && a.permission !== Permission.OWNER) {
            return 1;
          } else if (a.permission === Permission.ADMIN && b.permission !== Permission.ADMIN) {
            return -1;
          } else if (b.permission === Permission.ADMIN && a.permission !== Permission.ADMIN) {
            return 1;
          } else {
            return 0;
          }
        });
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
  
  createForm() {
    this.inviteForm = new FormGroup({
      usernameFormControl: new FormControl('', {validators: [Validators.required] })
    });
  }

	private getUser(): any {
		return this.storage.getSessionEntry('user');
	}

  get username(): string {
		return this.inviteForm.get('usernameFormControl')?.value;
	}

  getLanguage(key: string): string {
    const language = this.languages.find(lang => lang.key === key);
    return language ? language.label : key;
  }

  usernameValid(): boolean {
    return this.inviteForm.controls['usernameFormControl'].valid;
  }

  inviteUser(): void {
    this.api.inviteUser(this.getUser().token, this.username, this.getUser().project).subscribe(
      (user) => {
        this.members.push(user);
        this.inviteForm.controls['usernameFormControl'].reset();
        this.snackbar.open(this.translate.instant('SETTINGS.INVITE_SUCCESS'));
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

  removeUser(username: string, index: number): void {
    const data = {
      headline: this.translate.instant('SETTINGS.REMOVE_HEADLINE', { username: username }),
      description: this.translate.instant('SETTINGS.REMOVE_DESCRIPTION'),
      falseButton: this.translate.instant('APP.CANCEL'),
      trueButton: this.translate.instant('APP.REMOVE')
    };
    this.dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe((remove) => {
      if (remove) {
        this.api.removeUser(this.getUser().token, username).subscribe(
          (response) => {
            this.members.splice(index, 1);
            this.snackbar.open(this.translate.instant(response.message));
          },
          (error) => {
            if (error.status === 403) {
              this.storage.clearSession();
              this.router.navigateByUrl('/login');
            }
            this.snackbar.open(this.translate.instant(error.error.message));
          }
        )
      }
    });
  }

  disableAction(username: string) {
    return this.getUser().username === username;
  }

}
