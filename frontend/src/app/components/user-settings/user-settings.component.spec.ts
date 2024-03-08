import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsComponent } from './user-settings.component';
import { AppModule } from 'src/app/app.module';
import { environment } from 'src/environments/environment';
import { Permission } from 'src/app/enums/permission.enum';
import { TestService } from 'src/app/services/api/test.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import { LoginComponent } from '../login/login.component';
import { Router, RouterModule, ROUTES } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('UserSettingsComponent', () => {
	const mockRoutes = [
		{
			path: 'settings/user',
			component: UserSettingsComponent
		},
		{
			path: 'login',
			component: LoginComponent
		}
	];
	let component: UserSettingsComponent;
	let fixture: ComponentFixture<UserSettingsComponent>;
	let router: Router;
	let translateService: TranslateService;
	let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

	beforeEach(() => {
		snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
		TestBed.configureTestingModule({
			imports: [AppModule, TranslateModule.forRoot(), RouterModule.forRoot(mockRoutes)],
			declarations: [UserSettingsComponent],
			providers: [
				{ provide: TranslateService, useClass: TranslateService },
				{ provide: ROUTES, multi: true, useValue: [] },
				{ provide: ApiService, useClass: TestService },
				{ provide: MatSnackBar, useValue: snackbarSpy }
			]
		});
		fixture = TestBed.createComponent(UserSettingsComponent);
		translateService = TestBed.inject(TranslateService);
		router = TestBed.inject(Router);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('setup', () => {
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	
		it('should create', () => {
			expect(component).toBeTruthy();
		});
	});

	describe('formcontrol', () => {
		it('should create userSettingsForm', () => {
			expect(component.userSettingsForm).toBeDefined();
		});

		it('should create userSettingsForm with usernameFormControl', () => {
			expect(component.userSettingsForm.get('usernameFormControl')).toBeDefined();
		});

		it('should create userSettingsForm with fullNameFormControl', () => {
			expect(component.userSettingsForm.get('fullNameFormControl')).toBeDefined();
		});

		it('should create userSettingsForm with languageFormControl', () => {
			expect(component.userSettingsForm.get('languageFormControl')).toBeDefined();
		});

		it('should create userSettingsForm with passwordFormControl', () => {
			expect(component.userSettingsForm.get('passwordFormControl')).toBeDefined();
		});

		it('should create userSettingsForm with initialsFormControl', () => {
			expect(component.userSettingsForm.get('initialsFormControl')).toBeDefined();
		});

		it('should create userSettingsForm with colorFormControl', () => {
			expect(component.userSettingsForm.get('colorFormControl')).toBeDefined();
		});

		it('should create userSettingsForm with profilePictureFormControl', () => {
			expect(component.userSettingsForm.get('profilePictureFormControl')).toBeDefined();
		});

		it('should set validators for usernameFormControl', () => {
			const usernameErrors = component.userSettingsForm.get('usernameFormControl')?.errors;
			const isUsernameRequired = usernameErrors?.['required'];
			expect(isUsernameRequired).toBeTruthy();
		});

		it('should set validators for fullNameFormControl', () => {
			const fullnameErrors = component.userSettingsForm.get('fullNameFormControl')?.errors;
			const fullnameRequired = fullnameErrors?.['required'];
			expect(fullnameRequired).toBeTruthy();
		});

		it('should set validators for passwordFormControl', () => {
			const passwordErrors = component.userSettingsForm.get('passwordFormControl')?.errors;
			const isPasswordRequired = passwordErrors?.['required'];
			expect(isPasswordRequired).toBeTruthy();
		});

		it('should set validators for usernameFormControl', () => {
			const usernameErrors = component.userSettingsForm.get('initialsFormControl')?.errors;
			const isUsernameRequired = usernameErrors?.['required'];
			expect(isUsernameRequired).toBeTruthy();
		});

		it('should remove a file', () => {
			component.userSettingsForm.get('profilePictureFormControl')?.setValue('mock');	
			component.removeFile();
			expect(component.userSettingsForm.get('profilePictureFormControl')?.value).toBe('');
		});

		it('should return the profile picture', () => {
			component.userSettingsForm.get('profilePictureFormControl')?.setValue('mock');	
			expect(component.profilePicture).toBe('mock');
		});
	});

	describe('checks', () => {
		it('should have an error', () => {
			expect(component.hasError('usernameFormControl', 'required')).toBe(true);
		});

		it('should have no error', () => {
			component.userSettingsForm.get('usernameFormControl')?.setValue('mock');	
			expect(component.hasError('usernameFormControl', 'required')).toBe(false);
		});

		it('should be disabled', () => {
			expect(component.isDisabled('username')).toBe(true);
		});

		it('should not be disabled', () => {
			component.userSettingsForm.get('usernameFormControl')?.setValue('mock');	
			expect(component.isDisabled('username')).toBe(false);
		});

		it('should disable color', () => {
			expect(component.isDisabled('color')).toBe(true);
		});

		it('should not disabled color', () => {
			component.color = 'mock';
			expect(component.isDisabled('color')).toBe(false);
		});

		it('should disable profile picture', () => {
			expect(component.isDisabled('profilePicture')).toBe(true);
		});

		it('should not disabled profile picture', () => {
			component.userSettingsForm.get('profilePictureFormControl')?.setValue('mock');	
			expect(component.isDisabled('profilePicture')).toBe(false);
		});

		it('should have profile picture', () => {
			component.userSettingsForm.get('profilePictureFormControl')?.setValue('mock');	
			expect(component.hasProfilePicture()).toBeTruthy();
		});

		it('should not have profile picture', () => {
			expect(component.hasProfilePicture()).toBeFalsy();
		});

		it('should show delete button', () => {
			component['_user'].permission = Permission.ADMIN
			expect(component.showDelete()).toBe(true);
		});

		it('should not show delete button', () => {
			component['_user'].permission = Permission.OWNER
			expect(component.showDelete()).toBe(false);
		});

		it('should be loading', () => {
			component['_loadingAttribute'].username = true;
			expect(component.isLoading('username')).toBe(true);
		});

		it('should not be loading', () => {
			expect(component.isLoading('username')).toBe(false);
		});
	});

	describe('delete user', () => {
		it('should update the username', async () => {
			component['_user'].token = 'owner';
			await component.processUpdateUser('username', 'mock', true);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.UPDATE_ACCOUNT', 'APP.OK', { duration: 7000, panelClass: 'info' });
			expect(router.url).toBe('/login');
		});

		it('should update the fullName', async () => {
			component['_user'].token = 'owner';
			await component.processUpdateUser('fullName', 'mock', true);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.UPDATE_ACCOUNT', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});

		it('should update the language', async () => {
			component['_user'].token = 'owner';
			translateService.use('de');
			await component.processUpdateUser('language', 'en', true);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.UPDATE_ACCOUNT', 'APP.OK', { duration: 7000, panelClass: 'info' });
			expect(translateService.currentLang).toBe('en');
		});

		it('should update the password', async () => {
			component['_user'].token = 'owner';
			await component.processUpdateUser('password', 'mock', true);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.UPDATE_ACCOUNT', 'APP.OK', { duration: 7000, panelClass: 'info' });
			expect(component.userSettingsForm.get('passwordFormControl')?.value).toBe('');

		});

		it('should update the initials', async () => {
			component['_user'].token = 'owner';
			await component.processUpdateUser('initials', 'mock', true);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.UPDATE_ACCOUNT', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});

		it('should update the color', async () => {
			component['_user'].token = 'owner';
			await component.processUpdateUser('color', 'mock', true);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.UPDATE_ACCOUNT', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});

		it('should update the profilePicture', async () => {
			component['_user'].token = 'owner';
			await component.processUpdateUser('profilePicture', 'mock', true);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.UPDATE_ACCOUNT', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});

		it('should not update the user', async () => {
			component['_user'].token = 'owner';
			await component.processUpdateUser('username', 'mock', false);
			expect(snackbarSpy.open).not.toHaveBeenCalled();
		});
	});

	describe('delete user', () => {
		it('should delete the user', async () => {
			component['_user'].token = 'mock';
			await component.processDeleteUser(true);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.DELETE_ACCOUNT', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});

		it('should not delete the user', async () => {
			component['_user'].token = 'mock';
			await component.processDeleteUser(false);
			expect(snackbarSpy.open).not.toHaveBeenCalled();
		});
	});
});
