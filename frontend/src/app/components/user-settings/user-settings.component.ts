import { Component } from '@angular/core';
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
import { Permission } from 'src/app/enums/permission.enum';
import { ParserService } from 'src/app/services/parser.service';
import { lastValueFrom } from 'rxjs';
import { EventService } from 'src/app/services/event.service';

@Component({
	selector: 'app-user-settings',
	templateUrl: './user-settings.component.html',
	styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
	private _initialUser: User = this._user.user;
	private _loadingAttribute = {
		username: false,
		fullName: false,
		language: false,
		password: false,
		initials: false,
		color: false,
		profilePicture: false
	};

	public userSettingsForm!: FormGroup;
	public loadingDelete = false;
	public hidePassword = true;
	public color!: string;
	public languages: Language[] = [
		{
			key: 'en',
			label: 'English'
		},
		{
			key: 'de',
			label: 'Deutsch'
		},
		{
			key: 'es',
			label: 'Español'
		},
		{
			key: 'fr',
			label: 'Français'
		}
	];

	constructor(
		private _storage: StorageService,
		private _api: ApiService,
		private _router: Router,
		private _snackbar: SnackbarService,
		private _translate: TranslateService,
		private _dialog: MatDialog,
		private _user: UserService,
		private _error: ErrorService,
		private _parser: ParserService,
		private _event: EventService
	) {
		this._createForm();
	}

	private _createForm(): void {
		this.userSettingsForm = new FormGroup(
			{
				usernameFormControl: new FormControl('', { validators: [Validators.required] }),
				fullNameFormControl: new FormControl('', { validators: [Validators.required] }),
				languageFormControl: new FormControl('', { validators: [] }),
				passwordFormControl: new FormControl('', { validators: [Validators.required] }),
				initialsFormControl: new FormControl('', { validators: [Validators.required] }),
				colorFormControl: new FormControl('', { validators: [] }),
				profilePictureFormControl: new FormControl('', { validators: [] })
			},
			{ }
		);
		const controls = ['username', 'fullName', 'initials', 'language', 'color', 'password', 'profilePicture'];
		controls.forEach((control) => {
			this.userSettingsForm.get(control + 'FormControl')?.setValue(this._initialUser[control]);
		});
		this.color = this._initialUser.color;
	}

	public onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length) {
			const file = input.files[0];
			if (file.type.startsWith('image/')) {
				const reader = new FileReader;
				reader.onload = (e) => {
					this.userSettingsForm.get('profilePictureFormControl')?.setValue(e.target?.result as string);
				};
				reader.readAsDataURL(file);
			}
		}
	}

	public removeFile(): void {
		this.userSettingsForm.get('profilePictureFormControl')?.setValue('');
	}

	public async updateUser(attribute: string): Promise<void> {
		const value = attribute === 'color' ? this.color : this.userSettingsForm.get(attribute + 'FormControl')?.value;
		const key = this._translate.instant('USER.' + attribute.toUpperCase());
		const data = {
			headline: this._translate.instant('DIALOG.HEADLINE.CHANGE_ATTRIBUTE', { attribute: key }),
			description: this._translate.instant('DIALOG.INFO.CHANGE_ATTRIBUTE', { attribute: key }),
			falseButton: this._translate.instant('APP.CANCEL'),
			trueButton: this._translate.instant('APP.CONFIRM')
		};
		this._dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe(
			async (confirmed) => {
				await this.processUpdateUser(attribute, value, confirmed);
			}
		);
	}

	public async processUpdateUser(attribute: string, value: string, confirmed: boolean): Promise<void> {
		if (confirmed) {
			try {
				if (attribute === 'password') value = await this._parser.sha256(value);
				(this._loadingAttribute as any)[attribute] = true;          
				const response = await lastValueFrom(this._api.updateUser(this._user.token, attribute, value));
				(this._loadingAttribute as any)[attribute] = false;
				this._snackbar.open(this._translate.instant(response.message));
				this._user.update(attribute, value);
				this._initialUser = this._user.user;
				this._storage.setSessionEntry('user', this._user.user);
				switch (attribute) {
					case 'username':
						this._storage.clearSession();
						this._user.user = this._storage.getSessionEntry('user');
						this._router.navigateByUrl('/login');  
						break;
					case 'fullName':
						this._event.updateFullName$.next(value);
						break;
					case 'language':
						this._translate.use(value);
						break;
					case 'password':
						this.userSettingsForm.get('passwordFormControl')?.setValue('');
						break;
					case 'initials':
						this._event.updateInitials$.next(value);
						break;
					case 'color':
						this._event.updateColor$.next(value);
						break;
					case 'profilePicture':
						this._event.updateProfilePicture$.next(value);
						break;
					default:
						break;
				}
			} catch (error) {
				(this._loadingAttribute as any)[attribute] = false;
				this._error.handleApiError(error);
			}
		}
	}

	public async deleteUser(): Promise<void> {
		const data = {
			headline: this._translate.instant('DIALOG.HEADLINE.DELETE_ACCOUNT'),
			description: this._translate.instant('DIALOG.INFO.DELETE_ACCOUNT'),
			falseButton: this._translate.instant('APP.CANCEL'),
			trueButton: this._translate.instant('APP.CONFIRM')
		};
		this._dialog.open(DialogComponent, { data, ...{} }).afterClosed().subscribe(
			async (confirmed) => {
				await this.processDeleteUser(confirmed);
			}
		);
	}

	public async processDeleteUser(confirmed: boolean): Promise<void> {
		if (confirmed) {
			try {
				this.loadingDelete = true;
				const response = await lastValueFrom(this._api.deleteUser(this._user.token));
				this.loadingDelete = false;
				this._storage.clearSession();
				this._user.user = this._storage.getSessionEntry('user');
				this._router.navigateByUrl('/login');
				this._snackbar.open(this._translate.instant(response.message));
			} catch (error) {
				this.loadingDelete = false;
				this._error.handleApiError(error);
			}
		}
	}

	public get profilePicture(): string {
		return this.userSettingsForm.get('profilePictureFormControl')?.value;
	}

	public hasError(formControl: string, type: string): boolean {
		return this.userSettingsForm.controls[formControl].hasError(type);
	}

	public isDisabled(attribute: string): boolean {
		const value = attribute === 'color' ? this.color : this.userSettingsForm.get(attribute + 'FormControl')?.value;
		if (attribute === 'profilePicture') return this._initialUser[attribute] === value;
		return !this.userSettingsForm.get(attribute + 'FormControl')?.valid || this._initialUser[attribute] === value || value === '' || value === null;
	}

	public hasProfilePicture(): boolean {
		return this.userSettingsForm.get('profilePictureFormControl')?.value;
	}

	public showDelete(): boolean {
		return !this._user.hasPermission(Permission.OWNER);
	}

	public isLoading(attribute: string): boolean {
		return (this._loadingAttribute as any)[attribute];
	}
}
