import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';
import { environment } from 'src/environments/environment';

describe('EventService', () => {
	let service: EventService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(EventService);
	});

	it('should load test environment', () => {
		expect(environment.environement).toBe('test');
	});
  
	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
