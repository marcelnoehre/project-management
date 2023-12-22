import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should load test environment', () => {
		expect(environment.environement).toBe('test');
	});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
