import { TestBed } from '@angular/core/testing';

import { TestService } from './test.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
