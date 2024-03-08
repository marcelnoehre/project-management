import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';
import { environment } from 'src/environments/environment';

describe('EventService', () => {
	let eventService: EventService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		eventService = TestBed.inject(EventService);
	});

	describe('setup', () => {
		it('should be created', () => {
			expect(eventService).toBeTruthy();
		});
	
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	});

	describe('emit events', () => {
		it('should emit documentClick event', (done: DoneFn) => {
			const element = document.createElement('div');
			eventService.documentClick$.subscribe((element: Element) => {
			  	expect(element).toBe(element);
				done();
			});
			eventService.documentClick$.next(element);
		});
		
		it('should emit updateFullName event', (done: DoneFn) => {
			const fullName = 'Mock User';
			eventService.updateFullName$.subscribe((fullName: string) => {
				expect(fullName).toBe(fullName);
				done();
			});
			eventService.updateFullName$.next(fullName);
		});	
		
		it('should emit updateInitials event', (done: DoneFn) => {
			const initials = 'MU';
			eventService.updateInitials$.subscribe((initials: string) => {
				expect(initials).toBe(initials);
				done();
			});
			eventService.updateInitials$.next(initials);
		});
		
		it('should emit updateColor event', (done: DoneFn) => {
			const color = 'blue';
			eventService.updateColor$.subscribe((color: string) => {
				expect(color).toBe(color);
				done();
			});
			eventService.updateColor$.next(color);
		});
		
		it('should emit updateProfilePicture event', (done: DoneFn) => {
			const profilePicture = 'img.png';
			eventService.updateProfilePicture$.subscribe((pictureUrl: string) => {
				expect(pictureUrl).toBe(profilePicture);
				done();
			});
			eventService.updateProfilePicture$.next(profilePicture);
		});	
	});
});
