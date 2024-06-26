import { TestBed } from '@angular/core/testing';

import { MockService } from './mock.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/modules/material.module';
import { environment } from 'src/environments/environment';

describe('MockService', () => {
	let service: MockService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, TranslateModule.forRoot(), MaterialModule],
			providers: [{ provide: TranslateService, useClass: TranslateService }]
		});
		service = TestBed.inject(MockService);
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
