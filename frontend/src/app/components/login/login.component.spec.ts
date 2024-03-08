import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from 'src/app/app.module';
import { ApiService } from 'src/app/services/api/api.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { TestService } from 'src/app/services/api/test.service';
import { ROUTES, Router, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RegistrationComponent } from '../registration/registration.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Permission } from 'src/app/enums/permission.enum';

describe('LoginComponent', () => {
	const invited = {
		token: 'invited',
		username: 'invited',
		fullName: 'Mock Invited',
		initials: 'MI',
		color: '#FFFFFF',
		language: 'es',
		project: 'MockProject',
		permission: Permission.INVITED,
		profilePicture: '',
		notificationsEnabled: true,
		isLoggedIn: true,
		stats: {
			created: 77,
			imported: 42,
			updated: 19,
			edited: 56,
			trashed: 83,
			restored: 5,
			deleted: 38,
			cleared: 91,
		}
	}
	const mockRoutes = [
		{
			path: '',
			component: DashboardComponent
		},
		{
			path: 'login',
			component: LoginComponent
		},
		{
			path: 'registration',
			component: RegistrationComponent
		}
	];
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let translateService: TranslateService;
	let snackbarSpy: jasmine.SpyObj<MatSnackBar>;
	let router: Router;

	beforeEach(() => {
		snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
		TestBed.configureTestingModule({
			imports: [AppModule, TranslateModule.forRoot(), RouterModule.forRoot(mockRoutes)],
			declarations: [LoginComponent],
			providers: [
				{ provide: TranslateService, useClass: TranslateService },
				{ provide: ApiService, useClass: TestService },
				{ provide: UserService, useValue: UserService },
				{ provide: MatSnackBar, useValue: snackbarSpy },
				{ provide: ROUTES, multi: true, useValue: [] }
			]
		});
		fixture = TestBed.createComponent(LoginComponent);
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
		it('should create loginForm', () => {
			expect(component.loginForm).toBeDefined();
		});

		it('should create loginForm with usernameFormControl', () => {
			expect(component.loginForm.get('usernameFormControl')).toBeDefined();
		});

		it('should create loginForm with passwordFormControl', () => {
			expect(component.loginForm.get('passwordFormControl')).toBeDefined();
		});
	
		it('should set validators for usernameFormControl', () => {
			const usernameErrors = component.loginForm.get('usernameFormControl')?.errors;
			const isUsernameRequired = usernameErrors?.['required'];
			expect(isUsernameRequired).toBeTruthy();
		});

		it('should set validators for passwordFormControl', () => {
			const passwordErrors = component.loginForm.get('passwordFormControl')?.errors;
			const isPasswordRequired = passwordErrors?.['required'];
			expect(isPasswordRequired).toBeTruthy();
		});

		it('should return the correct username value', () => {
			component.loginForm.get('usernameFormControl')?.setValue('mockUsername');	
			const username = component['_username'];
			expect(username).toBe('mockUsername');
		});
	
		it('should return the correct password value', () => {
			component.loginForm.get('passwordFormControl')?.setValue('mockPassword');
			const password = component['_password'];
			expect(password).toBe('mockPassword');
		});

		it('should check if username is valid', () => {
			component.loginForm.controls['usernameFormControl'].setValue('validUsername');
			expect(component.userValid()).toBeTruthy();
		});
		
		it('should check if username is invalid', () => {
			component.loginForm.controls['usernameFormControl'].setValue('');
			expect(component.userValid()).toBeFalsy();
		});
	
		it('should check if password is valid', () => {
			component.loginForm.controls['passwordFormControl'].setValue('validPassword');
			expect(component.passwordValid()).toBeTruthy();
		});
	
		it('should check if password is invalid', () => {
			component.loginForm.controls['passwordFormControl'].setValue('');
			expect(component.passwordValid()).toBeFalsy();
		});
	});

	describe('login', () => {
		it('should login the user', async () => {
			component.loginForm.controls['usernameFormControl'].setValue('owner');
			component.loginForm.controls['passwordFormControl'].setValue('1234');
			await component.login();
			expect(router.url).toBe('/');
		});

		it('should create a project', async () => {
			router.navigateByUrl('/login');
			component['_user'].language = 'es';
			component.processCreateProject(true);
			expect(translateService.currentLang).toBe('es');
			expect(router.url).toBe('/');
		});

		it('should not create a project', async () => {
			component['_user'].language = 'es';
			component.processCreateProject(false);
			expect(translateService.currentLang).toBeUndefined();
		});

		it('should accept invite', async () => {
			component['_user'].token = 'invited';
			component['_user'].language = 'es';
			await component.processHandleInvite(invited, true);
			expect(component['_user'].token).toBe('invited');
			expect(component['_user'].permission).toBe(Permission.MEMBER);
			expect(component['_user'].project).toBe('MockProject');
			expect(component['_user'].isLoggedIn).toBe(true);
			expect(translateService.currentLang).toBe('es');
			expect(router.url).toBe('/');
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.INVITE_ACCEPTED', 'APP.OK', { duration: 7000, panelClass: 'info' });	
		});

		it('should reject invite', async () => {
			component['_user'].token = 'invited';
			component['_user'].language = 'es';
			await component.processHandleInvite(invited, false);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.INVITE_REJECTED', 'APP.OK', { duration: 7000, panelClass: 'info' });	
		});

		it('should display error for invalid credentials', async () => {
			component.loginForm.controls['usernameFormControl'].setValue('invalid');
			component.loginForm.controls['passwordFormControl'].setValue('1234');
			await component.login();
			expect(snackbarSpy.open).toHaveBeenCalledWith(
				jasmine.any(Error),
				'APP.OK',
				{ duration: 7000, panelClass: 'info' }
			);
		});
	});

	describe('language', () => {
		it('should update the language', () => {
			translateService.use('en');
			component['_user'].language = 'de';
			component.updateLanguage();
			expect(translateService.currentLang).toBe('de');
		});

		it('should not update the language', () => {
			translateService.use('en');
			component['_user'].language = '';
			component.updateLanguage();
			expect(translateService.currentLang).toBe('en');
		});
	});

	it('should redirect to the registration', fakeAsync(() => {
		component.registration();
		tick();
		expect(router.url).toBe('/registration');
	}));
});
