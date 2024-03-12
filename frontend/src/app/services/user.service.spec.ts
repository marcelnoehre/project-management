import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { Permission } from '../enums/permission.enum';

describe('UserService', () => {
	let userService: UserService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [UserService],
		});
		userService = TestBed.inject(UserService);
	});

	describe('setup', () => {
		it('should be created', () => {
			expect(userService).toBeTruthy();
		});
	
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	});

	describe('combined set & get', () => {
		it('should set user properties correctly', () => {
			userService.user = {
				token: 'testToken',
				username: 'testUser',
				fullName: 'Test User',
				language: 'en',
				profilePicture: 'img.jpg',
				initials: 'TU',
				color: 'blue',
				project: 'Test Project',
				permission: Permission.ADMIN,
				notificationsEnabled: true,
				isLoggedIn: true,
				stats: {
					created: 1,
					imported: 2,
					updated: 3,
					edited: 4,
					trashed: 5,
					restored: 6,
					deleted: 7,
					cleared: 8,
				},
			};
		
			expect(userService.token).toBe('testToken');
			expect(userService.username).toBe('testUser');
			expect(userService.fullName).toBe('Test User');
			expect(userService.language).toBe('en');
			expect(userService.profilePicture).toBe('img.jpg');
			expect(userService.initials).toBe('TU');
			expect(userService.color).toBe('blue');
			expect(userService.project).toBe('Test Project');
			expect(userService.permission).toBe(Permission.ADMIN);
			expect(userService.notificationsEnabled).toBe(true);
			expect(userService.isLoggedIn).toBe(true);
		});

		it('should update the user attribute: token', () => {
			userService.token = 'testToken';
			expect(userService.token).toBe('testToken');
		});

		it('should update the user attribute: username', () => {
			userService.username = 'testUser';
			expect(userService.username).toBe('testUser');
		});

		it('should update the user attribute: fullName', () => {
			userService.fullName = 'Test User';
			expect(userService.fullName).toBe('Test User');
		});

		it('should update the user attribute: language', () => {
			userService.language = 'en';
			expect(userService.language).toBe('en');
		});

		it('should update the user attribute: profilePicture', () => {
			userService.profilePicture = 'img.jpg';
			expect(userService.profilePicture).toBe('img.jpg');
		});

		it('should update the user attribute: initials', () => {
			userService.initials = 'TU';
			expect(userService.initials).toBe('TU');
		});

		it('should update the user attribute: color', () => {
			userService.color = 'blue';
			expect(userService.color).toBe('blue');
		});

		it('should update the user attribute: project', () => {
			userService.project = 'Test Project';
			expect(userService.project).toBe('Test Project');
		});

		it('should update the user attribute: permission', () => {
			userService.permission = Permission.ADMIN;
			expect(userService.permission).toBe(Permission.ADMIN);
		});

		it('should update the user attribute: notificationsEnabled', () => {
			userService.notificationsEnabled = true;
			expect(userService.notificationsEnabled).toBe(true);
		});

		it('should update the user attribute: isLoggedIn', () => {
			userService.isLoggedIn = true;
			expect(userService.isLoggedIn).toBe(true);
		});
	});

	it('should update user attributes correctly', () => {
		userService.update('fullName', 'Updated User');
		expect(userService.fullName).toBe('Updated User');
	});

	it('should check permissions correctly', () => {
		userService.permission = Permission.MEMBER;
		expect(userService.hasPermission(Permission.NONE)).toBe(true);
		expect(userService.hasPermission(Permission.INVITED)).toBe(true);
		expect(userService.hasPermission(Permission.MEMBER)).toBe(true);
		expect(userService.hasPermission(Permission.ADMIN)).toBe(false);
		expect(userService.hasPermission(Permission.OWNER)).toBe(false);
	});
});
