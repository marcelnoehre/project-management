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

describe('LoginComponent', () => {
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
