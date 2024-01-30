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
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent implements OnInit {
  loadingInvite: boolean = false;
  loadingLeave: boolean = false;
  loadingDelete: string = '';
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
    private router: Router,
    private user: UserService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.api.getTeamMembers(this.user.token, this.user.project).subscribe(
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
    if (this.members.some(member => member.username === this.username)) {
      this.snackbar.open(this.translate.instant('ERROR.IN_PROJECT'));
    } else {
      this.loadingInvite = true;
      this.api.inviteUser(this.user.token, this.username, this.user.project).subscribe(
        (user) => {
          this.loadingInvite = false;
          this.members.push(user);
          this.inviteForm.controls['usernameFormControl'].reset();
          this.snackbar.open(this.translate.instant('SUCCESS.INVITE_DELIVERD'));
        },
        (error) => {
          this.loadingInvite = false;
          if (error.status === 403) {
            this.storage.clearSession();
            this.router.navigateByUrl('/login');
          }
          this.snackbar.open(this.translate.instant(error.error.message));
        }
      );
    } 
  }

  removeUser(username: string, index: number): void {
    const data = {
      headline: this.translate.instant('DIALOG.HEADLINE.REMOVE_MEMBER', { username: username }),
      description: this.translate.instant('DIALOG.INFO.REMOVE_MEMBER'),
      falseButton: this.translate.instant('APP.CANCEL'),
      trueButton: this.translate.instant('APP.REMOVE')
    };
    this.dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe((remove) => {
      if (remove) {
        this.loadingDelete = username;
        this.api.removeUser(this.user.token, username).subscribe(
          (response) => {
            this.loadingDelete = '';
            this.members.splice(index, 1);
            this.snackbar.open(this.translate.instant(response.message));
          },
          (error) => {
            this.loadingDelete = '';
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

  leaveProject() {
    const data = {
      headline: this.translate.instant('DIALOG.HEADLINE.LEAVE_PROJECT'),
      description: this.translate.instant('DIALOG.INFO.LEAVE_PROJECT'),
      falseButton: this.translate.instant('APP.CANCEL'),
      trueButton: this.translate.instant('APP.CONFIRM')
    };
    this.dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe(
      async (confirmed) => {
        if (confirmed) {
          this.loadingLeave = true;
          this.api.leaveProject(this.user.token, this.user.username).subscribe(
            (response) => {
              this.loadingLeave = false;
              this.storage.deleteSessionEntry('user');
              this.user.user = this.storage.getSessionEntry('user');
              this.snackbar.open(this.translate.instant(response.message));
              this.router.navigateByUrl('/login');
            },
            (error) => {
              this.loadingLeave = false;
              if (error.status === 403) {
                this.storage.clearSession();
                this.router.navigateByUrl('/login');
              }
              this.snackbar.open(this.translate.instant(error.error.message));
            }
          );
        }
      });
  }

  disableRemove(permission: string) {
    permission = permission as Permission;
    const required: Permission = permission === Permission.ADMIN ? Permission.OWNER : Permission.ADMIN;
    return !this.user.hasPermission(required) || permission === Permission.OWNER;
  }

  deleteLoading(username: string) {
    return username === this.loadingDelete;
  }

  leavable(): boolean {
    return this.user.hasPermission(Permission.OWNER);
  }
}
