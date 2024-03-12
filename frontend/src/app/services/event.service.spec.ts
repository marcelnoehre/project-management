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
			const domElement = document.createElement('div');
			eventService.documentClick$.subscribe((element: Element) => {
				expect(element).toBe(domElement);
				done();
			});
			eventService.documentClick$.next(domElement);
		});
		
		it('should emit updateFullName event', (done: DoneFn) => {
			const localFullName = 'Mock User';
			eventService.updateFullName$.subscribe((fullName: string) => {
				expect(fullName).toBe(localFullName);
				done();
			});
			eventService.updateFullName$.next(localFullName);
		});	
		
		it('should emit updateInitials event', (done: DoneFn) => {
			const localInitials = 'MU';
			eventService.updateInitials$.subscribe((initials: string) => {
				expect(initials).toBe(localInitials);
				done();
			});
			eventService.updateInitials$.next(localInitials);
		});
		
		it('should emit updateColor event', (done: DoneFn) => {
			const localColor = 'blue';
			eventService.updateColor$.subscribe((color: string) => {
				expect(color).toBe(localColor);
				done();
			});
			eventService.updateColor$.next(localColor);
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
