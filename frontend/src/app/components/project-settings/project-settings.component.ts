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
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent implements OnInit {
  permissions: Permission[] = [Permission.MEMBER, Permission.ADMIN];
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
    private user: UserService,
    private _error: ErrorService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.api.getTeamMembers(this.user.token).subscribe(
      (users) => {
        this.members = users;
      },
      (error) => {
        this._error.handleApiError(error);
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
      this.api.inviteUser(this.user.token, this.username).subscribe(
        (user) => {
          this.loadingInvite = false;
          this.members.push(user);
          this.inviteForm.controls['usernameFormControl'].reset();
          this.snackbar.open(this.translate.instant('SUCCESS.INVITE_DELIVERD'));
        },
        (error) => {
          this.loadingInvite = false;
          this._error.handleApiError(error);
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
            this._error.handleApiError(error);
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
          this.api.leaveProject(this.user.token).subscribe(
            (response) => {
              this.loadingLeave = false;
              this.storage.deleteSessionEntry('user');
              this.user.user = this.storage.getSessionEntry('user');
              this.snackbar.open(this.translate.instant(response.message));
              this.router.navigateByUrl('/login');
            },
            (error) => {
              this.loadingLeave = false;
              this._error.handleApiError(error);
            }
          );
        }
      });
  }

  updatePermission(username: string, event: any) {
    this.api.updatePermission(this.user.token, username, event.value).subscribe(
      (response) => {
        this.snackbar.open(this.translate.instant('SUCCESS.PERMISSION_UPDATED'));
        this.members = response;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }

  editable(permission: Permission) {
    if (permission === Permission.ADMIN) {
      return this.user.hasPermission(Permission.OWNER);
    } else if (permission === Permission.MEMBER) {
      return this.user.hasPermission(Permission.ADMIN);
    } else {
      return false;
    }
  }

  showInvite() {
    return this.user.hasPermission(Permission.ADMIN);
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
