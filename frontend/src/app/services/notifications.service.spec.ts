import { TestBed } from '@angular/core/testing';
import { Notification } from '../interfaces/data/notification';
import { NotificationsService } from './notifications.service';
import { AppModule } from '../app.module';
import { environment } from 'src/environments/environment';
import { of, throwError } from 'rxjs';
import { ApiService } from './api/api.service';
import { ErrorService } from './error.service';
import { UserService } from './user.service';

describe('NotificationsService', () => {
	const mockNotifications = [
		{
			uid: "lPMZOH0Hxy6z0mhZ9shV", 
			message: "NOTIFICATIONS.NEW.JOINED", 
			data: ["admin"], 
			icon: "person_add", 
			timestamp: 1707948598239, 
			seen: false 
		},
		{ 
			uid: "lk8id9WVL0N1o97vRDK6", 
			message: "NOTIFICATIONS.NEW.CREATE_TASK", 
			data: ["admin", "mock"], 
			icon: "note_add", 
			timestamp: 1707948640062, 
			seen: true 
		}
	]

	let notificationsService: NotificationsService;
	let apiServiceSpy: jasmine.SpyObj<ApiService>;
	let userServiceSpy: jasmine.SpyObj<UserService>;
	let errorServiceSpy: jasmine.SpyObj<ErrorService>;

	beforeEach(() => {
		apiServiceSpy = jasmine.createSpyObj('ApiService', ['getNotifications', 'updateNotifications']);
		userServiceSpy = jasmine.createSpyObj('UserService', ['get token']);
		errorServiceSpy = jasmine.createSpyObj('ErrorService', ['handleApiError']);

		TestBed.configureTestingModule({
			imports: [AppModule],
			providers: [
				NotificationsService,
				{ provide: ApiService, useValue: apiServiceSpy },
				{ provide: UserService, useValue: userServiceSpy },
				{ provide: ErrorService, useValue: errorServiceSpy },
			  ]
		});

		notificationsService = TestBed.inject(NotificationsService);
	});

	describe('setup', () => {
		it('should be created', () => {
			expect(notificationsService).toBeTruthy();
		});
	
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	});

	describe('init', () => {
		it('should initialize notifications and update unseen count', async () => {
			apiServiceSpy.getNotifications.and.returnValue(of(mockNotifications));
			userServiceSpy.token = 'mockToken';
			await notificationsService.init();
			expect(apiServiceSpy.getNotifications).toHaveBeenCalledWith('mockToken');
			expect(notificationsService.isLoading()).toBeFalse();
			expect(notificationsService.getNotifications).toEqual(mockNotifications);
			expect(notificationsService.unseenNotifications).toEqual(1);
		});
	
		it('should handle error and call errorService', async () => {
			const error = new Error('Mock Error');
			apiServiceSpy.getNotifications.and.returnValue(throwError(error));
			await notificationsService.init();
			expect(apiServiceSpy.getNotifications).toHaveBeenCalled();
			expect(notificationsService.isLoading()).toBeFalse();
			expect(errorServiceSpy.handleApiError).toHaveBeenCalledWith(error);
		});
	  });
	
	  describe('update', () => {
		it('should update notifications and unseen count', async () => {
			apiServiceSpy.updateNotifications.and.returnValue(of(mockNotifications));
			userServiceSpy.token = 'mockToken';
			await notificationsService.update(['mock'], []);
			expect(apiServiceSpy.updateNotifications).toHaveBeenCalledWith('mockToken', ['mock'], []);
			expect(notificationsService.getNotifications).toEqual(mockNotifications);
			expect(notificationsService.unseenNotifications).toEqual(1);
		});
	
		it('should handle error and call errorService', async () => {
			const error = new Error('Mock Error');
			apiServiceSpy.updateNotifications.and.returnValue(throwError(error));
			await notificationsService.update([], ['mock']);
			expect(apiServiceSpy.updateNotifications).toHaveBeenCalled();
			expect(errorServiceSpy.handleApiError).toHaveBeenCalledWith(error);
		});
	});
});
