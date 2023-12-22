import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authGuard } from './auth.guard';
import { environment } from 'src/environments/environment';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should load test environment', () => {
		expect(environment.selectedApi).toBe('test');
	});

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
