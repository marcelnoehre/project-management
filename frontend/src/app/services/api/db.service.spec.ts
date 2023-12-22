import { TestBed } from '@angular/core/testing';

import { DbService } from './db.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('DbService', () => {
  let service: DbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DbService);
  });

  it('should load test environment', () => {
		expect(environment.selectedApi).toBe('test');
	});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
