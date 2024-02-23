import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from '../app.module';

describe('ErrorService', () => {
	let service: ErrorService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot(), AppModule],
			providers: [
				{ provide: TranslateService, useClass: TranslateService },
			]
		});
		service = TestBed.inject(ErrorService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
