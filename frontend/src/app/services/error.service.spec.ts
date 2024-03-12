import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SnackbarService } from './snackbar.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { Permission } from '../enums/permission.enum';

describe('ErrorService', () => {
	const user = {
		token: '',
		username: '',
		fullName: '',
		language: '',
		profilePicture: '',
		initials: '',
		color: '',
		project: '',
		permission: Permission.NONE,
		notificationsEnabled: true,
		isLoggedIn: false,
		stats: {
			created: -1,
			imported: -1,
			updated: -1,
			edited: -1,
			trashed: -1,
			restored: -1,
			deleted: -1,
			cleared: -1
		}
	};
	const none: any = null;
	
	let errorService: ErrorService;
	let userServiceSpy: jasmine.SpyObj<UserService>;
	let storageServiceSpy: jasmine.SpyObj<StorageService>;
	let routerSpy: jasmine.SpyObj<any>;
	let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
	let translateServiceSpy: jasmine.SpyObj<TranslateService>;

	beforeEach(() => {
		userServiceSpy = jasmine.createSpyObj('UserService', ['clearSession'], { user: null });
		storageServiceSpy = jasmine.createSpyObj('StorageService', ['clearSession', 'getSessionEntry']);
		routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
		snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['open']);
		translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);

		TestBed.configureTestingModule({
			imports: [RouterTestingModule, TranslateModule.forRoot()],
			providers: [
				ErrorService,
				{ provide: UserService, useValue: userServiceSpy },
				{ provide: StorageService, useValue: storageServiceSpy },
				{ provide: Router, useValue: routerSpy },
				{ provide: SnackbarService, useValue: snackbarServiceSpy },
				{ provide: TranslateService, useValue: translateServiceSpy },
			]
		});

		errorService = TestBed.inject(ErrorService);
	});

	describe('setup', () => {
		it('should be created', () => {
			expect(errorService).toBeTruthy();
		});
	
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	});

	describe('handleApiError', () => {
		it('should handle 403 status code by calling handleInvalidUser', () => {
			const error = { status: 403 };
			spyOn(errorService, 'handleInvalidUser');
			errorService.handleApiError(error);
			expect(errorService.handleInvalidUser).toHaveBeenCalled();
		});
	
		it('should handle error with translated message', () => {
			const error = { error: { message: 'ERROR_MESSAGE_KEY' } };
			translateServiceSpy.instant.and.returnValue('Translated Error Message');
			errorService.handleApiError(error);
			expect(snackbarServiceSpy.open).toHaveBeenCalledWith('Translated Error Message');
		});
	
		it('should handle server error', () => {
			const error = { statusText: 'Server Error' };
			errorService.handleApiError(error);
			expect(snackbarServiceSpy.open).toHaveBeenCalledWith('Server Error');
		});
	
		it('should handle generic error', () => {
			const error = 'Mock Error';
			errorService.handleApiError(error);
			expect(snackbarServiceSpy.open).toHaveBeenCalledWith('Mock Error');
		});
	});
	
	it('should clear session, get user from session, and navigate to login', () => {
		storageServiceSpy.getSessionEntry.and.returnValue(user);
		errorService.handleInvalidUser();
		expect(storageServiceSpy.clearSession).toHaveBeenCalled();
		expect(userServiceSpy.user).toEqual(none);
		expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
	});
});
