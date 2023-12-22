import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/modules/material.module';
import { environment } from 'src/environments/environment';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), MaterialModule],
      providers: [{ provide: TranslateService, useClass: TranslateService }]
    });
    service = TestBed.inject(ApiService);
  });

  it('should load test environment', () => {
		expect(environment.environement).toBe('test');
	});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
