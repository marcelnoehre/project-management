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
import { lastValueFrom } from 'rxjs';

@Component({
	selector: 'app-project-settings',
	templateUrl: './project-settings.component.html',
	styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent implements OnInit {
	private _loadingDelete = '';
	private _languages: Language[] = [
		{
			key: 'en',
			label: 'English'
		},
		{
			key: 'de',
			label: 'Deutsch'
		}
	];

	public permissions: Permission[] = [Permission.MEMBER, Permission.ADMIN];
	public loadingInvite = false;
	public loadingLeave = false;
	public inviteForm!: FormGroup;
	public members: User[] = [];

	constructor(
		private _api: ApiService,
		private _storage: StorageService,
		private _snackbar: SnackbarService,
		private _translate: TranslateService,
		private _dialog: MatDialog,
		private _router: Router,
		private _user: UserService,
		private _error: ErrorService
	) {
		this._createForm();
	}

	async ngOnInit(): Promise<void> {
		try {
			this.members = await lastValueFrom(this._api.getTeamMembers(this._user.token));
		} catch (error) {
			this._error.handleApiError(error);
		}
	}
  
	private _createForm() {
		this.inviteForm = new FormGroup({
			usernameFormControl: new FormControl('', { validators: [Validators.required] })
		});
	}

	private get _username(): string {
		return this.inviteForm.get('usernameFormControl')?.value;
	}

	public async inviteUser(): Promise<void> {
		if (this.members.some(member => member.username === this._username)) {
			this._snackbar.open(this._translate.instant('ERROR.IN_PROJECT'));
		} else {
			this.loadingInvite = true;
			try {
				const user = await lastValueFrom(this._api.inviteUser(this._user.token, this._username));
				this.members.push(user);
				this.loadingInvite = false;
				this.inviteForm.controls['usernameFormControl'].reset();
				this._snackbar.open(this._translate.instant('SUCCESS.INVITE_DELIVERD'));
			} catch (error) {
				this.loadingInvite = false;
				this._error.handleApiError(error);
			}
		} 
	}

	public removeUser(username: string, index: number): void {
		const data = {
			headline: this._translate.instant('DIALOG.HEADLINE.REMOVE_MEMBER', { username: username }),
			description: this._translate.instant('DIALOG.INFO.REMOVE_MEMBER'),
			falseButton: this._translate.instant('APP.CANCEL'),
			trueButton: this._translate.instant('APP.REMOVE')
		};
		this._dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe(async (remove) => {
			if (remove) {
				this._loadingDelete = username;
				try {
					const response = await lastValueFrom(this._api.removeUser(this._user.token, username));
					this._loadingDelete = '';
					this.members.splice(index, 1);
					this._snackbar.open(this._translate.instant(response.message));
				} catch (error) {
					this._loadingDelete = '';
					this._error.handleApiError(error);
				}
			}
		});
	}

	public leaveProject(): void {
		const data = {
			headline: this._translate.instant('DIALOG.HEADLINE.LEAVE_PROJECT'),
			description: this._translate.instant('DIALOG.INFO.LEAVE_PROJECT'),
			falseButton: this._translate.instant('APP.CANCEL'),
			trueButton: this._translate.instant('APP.CONFIRM')
		};
		this._dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe(
			async (confirmed) => {
				if (confirmed) {
					this.loadingLeave = true;
					try {
						const response = await lastValueFrom(this._api.leaveProject(this._user.token));
						this.loadingLeave = false;
						this._storage.deleteSessionEntry('user');
						this._user.user = this._storage.getSessionEntry('user');
						this._snackbar.open(this._translate.instant(response.message));
						this._router.navigateByUrl('/login');
					} catch (error) {
						this.loadingLeave = false;
						this._error.handleApiError(error);
					}
				}
			});
	}

	public async updatePermission(username: string, event: any): Promise<void> {
		try {
			this.members = await lastValueFrom(this._api.updatePermission(this._user.token, username, event.value));
			this._snackbar.open(this._translate.instant('SUCCESS.PERMISSION_UPDATED'));
		} catch (error) {
			this._error.handleApiError(error);
		}
	}

	public deleteLoading(username: string): boolean {
		return username === this._loadingDelete;
	}

	public getLanguage(key: string): string {
		const language = this._languages.find(lang => lang.key === key);
		return language ? language.label : key;
	}

	public usernameValid(): boolean {
		return this.inviteForm.controls['usernameFormControl'].valid;
	}

	public isEditable(permission: Permission): boolean {
		if (permission === Permission.ADMIN) {
			return this._user.hasPermission(Permission.OWNER);
		} else if (permission === Permission.MEMBER) {
			return this._user.hasPermission(Permission.ADMIN);
		} else {
			return false;
		}
	}

	public isLeavable(): boolean {
		return this._user.hasPermission(Permission.OWNER);
	}

	public showInvite(): boolean {
		return this._user.hasPermission(Permission.ADMIN);
	}

	public disableRemove(permission: string): boolean {
		permission = permission as Permission;
		const required: Permission = permission === Permission.ADMIN ? Permission.OWNER : Permission.ADMIN;
		return !this._user.hasPermission(required) || permission === Permission.OWNER;
	}

	public hasError(formControl: string, type: string): boolean {
		return this.inviteForm.controls[formControl].hasError(type);
	}
}
