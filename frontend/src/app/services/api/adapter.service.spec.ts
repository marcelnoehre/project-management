import { TestBed } from '@angular/core/testing';

import { AdapterService } from './adapter.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('AdapterService', () => {
  let service: AdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AdapterService);
  });

  it('should load test environment', () => {
		expect(environment.environement).toBe('test');
	});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
