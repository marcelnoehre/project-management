import { TestBed } from '@angular/core/testing';

import { DbService } from './db.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DbService', () => {
  let service: DbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
