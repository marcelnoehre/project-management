import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';
import { MaterialModule } from '../modules/material.module';
import { TranslateModule } from '@ngx-translate/core';

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot()]
    });
    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
