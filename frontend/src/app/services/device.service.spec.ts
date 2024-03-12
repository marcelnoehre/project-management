import { TestBed } from '@angular/core/testing';

import { DeviceService } from './device.service';
import { Router, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';
import { Viewport } from '../enums/viewport.enum';
import { environment } from 'src/environments/environment';

describe('DeviceService', () => {
	let deviceService: DeviceService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DeviceService, { provide: Router, useValue: { events: of(new NavigationEnd(0, '/', '/')) } }]
		});
		deviceService = TestBed.inject(DeviceService);
	});

	describe('setup', () => {
		it('should be created', () => {
			expect(deviceService).toBeTruthy();
		});
	
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	});

	describe('width', () => {
		it('should return true for isSmallScreen if width is less than Viewport.MD', () => {
			deviceService['_width'] = Viewport.MD - 1;
			expect(deviceService.isSmallScreen()).toBe(true);
		});
		
		it('should return false for isSmallScreen if width is equal to or greater than Viewport.MD', () => {
			deviceService['_width'] = Viewport.MD + 1;
			expect(deviceService.isSmallScreen()).toBe(false);
		});
	});
	
	it('should get activeRoute', () => {
		deviceService.init();
		expect(deviceService.activeRoute).toBe('/');
	});
});
