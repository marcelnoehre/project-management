import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { AppModule } from 'src/app/app.module';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginComponent } from '../login/login.component';
import { Router, RouterModule, ROUTES } from '@angular/router';

describe('RegistrationComponent', () => {
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
	let component: RegistrationComponent;
	let fixture: ComponentFixture<RegistrationComponent>;
	let router: Router;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AppModule, RouterModule.forRoot(mockRoutes)],
			declarations: [RegistrationComponent],
			providers: [
				{ provide: ROUTES, multi: true, useValue: [] }
			]
		});
		fixture = TestBed.createComponent(RegistrationComponent);
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
		it('should create registrationForm', () => {
			expect(component.registrationForm).toBeDefined();
		});

		it('should create registrationForm with usernameFormControl', () => {
			expect(component.registrationForm.get('usernameFormControl')).toBeDefined();
		});

		it('should create registrationForm with fullnameFormControl', () => {
			expect(component.registrationForm.get('fullnameFormControl')).toBeDefined();
		});

		it('should create registrationForm with languageFormControl', () => {
			expect(component.registrationForm.get('languageFormControl')).toBeDefined();
		});

		it('should create registrationForm with passwordFormControl', () => {
			expect(component.registrationForm.get('passwordFormControl')).toBeDefined();
		});

		it('should create registrationForm with passwordRepeatFormControl', () => {
			expect(component.registrationForm.get('passwordRepeatFormControl')).toBeDefined();
		});
	
		it('should set validators for usernameFormControl', () => {
			const usernameErrors = component.registrationForm.get('usernameFormControl')?.errors;
			const isUsernameRequired = usernameErrors?.['required'];
			expect(isUsernameRequired).toBeTruthy();
		});

		it('should set validators for fullnameFormControl', () => {
			const fullNameErrors = component.registrationForm.get('fullnameFormControl')?.errors;
			const isfullNameRequired = fullNameErrors?.['required'];
			expect(isfullNameRequired).toBeTruthy();
		});

		it('should set validators for passwordFormControl', () => {
			const passwordErrors = component.registrationForm.get('passwordFormControl')?.errors;
			const isPasswordRequired = passwordErrors?.['required'];
			expect(isPasswordRequired).toBeTruthy();
		});

		it('should set validators for passwordRepeatFormControl', () => {
			const passwordRepeatErrors = component.registrationForm.get('passwordRepeatFormControl')?.errors;
			const isPasswordRepeatRequired = passwordRepeatErrors?.['required'];
			expect(isPasswordRepeatRequired).toBeTruthy();
		});

		it('should return the correct username value', () => {
			component.registrationForm.get('usernameFormControl')?.setValue('mockUsername');	
			const username = component['_username'];
			expect(username).toBe('mockUsername');
		});

		it('should return the correct full name value', () => {
			component.registrationForm.get('fullnameFormControl')?.setValue('mockFullName');	
			const fullName = component['_fullName'];
			expect(fullName).toBe('mockFullName');
		});

		it('should return the correct language value', () => {
			component.registrationForm.get('languageFormControl')?.setValue('mockLanguage');	
			const language = component['_language'];
			expect(language).toBe('mockLanguage');
		});
	
		it('should return the correct password value', () => {
			component.registrationForm.get('passwordFormControl')?.setValue('mockPassword');
			const password = component['_password'];
			expect(password).toBe('mockPassword');
		});

		it('should return the correct password repeat value', () => {
			component.registrationForm.get('passwordRepeatFormControl')?.setValue('mockPassword');
			const passwordRepeat = component['_passwordRepeat'];
			expect(passwordRepeat).toBe('mockPassword');
		});

		it('should check if username is valid', () => {
			component.registrationForm.controls['usernameFormControl'].setValue('validUsername');
			expect(component.usernameValid()).toBeTruthy();
		});
		
		it('should check if username is invalid', () => {
		component.registrationForm.controls['usernameFormControl'].setValue('');
		expect(component.usernameValid()).toBeFalsy();
		});

		it('should check if full name is valid', () => {
			component.registrationForm.controls['fullnameFormControl'].setValue('validFullName');
			expect(component.fullnameValid()).toBeTruthy();
		});
		
		it('should check if full name is invalid', () => {
		component.registrationForm.controls['fullnameFormControl'].setValue('');
		expect(component.fullnameValid()).toBeFalsy();
		});
	
		it('should check if password is valid', () => {
			component.registrationForm.controls['passwordFormControl'].setValue('test*0TEST');
			expect(component.passwordValid()).toBeTruthy();
		});
	
		it('should check if password is invalid', () => {
			component.registrationForm.controls['passwordFormControl'].setValue('');
			expect(component.passwordValid()).toBeFalsy();
		});

		it('should check if password repeat is valid', () => {
			component.registrationForm.controls['passwordRepeatFormControl'].setValue('test*0TEST');
			expect(component.passwordRepeatValid()).toBeTruthy();
		});
	
		it('should check if password repeat is invalid', () => {
			component.registrationForm.controls['passwordRepeatFormControl'].setValue('');
			expect(component.passwordValid()).toBeFalsy();
		});
	});

	describe('register', () => {
		it('should register the user', async () => {
			component.registrationForm.get('usernameFormControl')?.setValue('mock');	
			component.registrationForm.get('fullnameFormControl')?.setValue('fullname');
			component.registrationForm.controls['passwordFormControl'].setValue('test*0TEST');
			component.registrationForm.controls['passwordRepeatFormControl'].setValue('test*0TEST');
			await component.register();
			expect(router.url).toBe('/login');
		});
	});

	it('should redirect to the login', fakeAsync(() => {
		component.login();
		tick();
		expect(router.url).toBe('/login');
	}));
});
