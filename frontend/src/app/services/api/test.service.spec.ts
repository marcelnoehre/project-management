import { TestBed } from '@angular/core/testing';

import { TestService } from './test.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

describe('TestService', () => {
	let service: TestService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [
				{ provide: TranslateService, useClass: TranslateService }
			]
		});
		service = TestBed.inject(TestService);
	});

	describe('setup', () => {
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	
		it('should create', () => {
			expect(service).toBeTruthy();
		});
	});
});
