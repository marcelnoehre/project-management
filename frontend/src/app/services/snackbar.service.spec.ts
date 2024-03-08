import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';
import { MaterialModule } from '../modules/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { SnackbarType } from '../enums/snackbar-type.enum';

describe('SnackbarService', () => {
	let snackbarService: SnackbarService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [MaterialModule, TranslateModule.forRoot()]
		});
		snackbarService = TestBed.inject(SnackbarService);
	});

	describe('setup', () => {
		it('should be created', () => {
			expect(snackbarService).toBeTruthy();
		});
	
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	});

	describe('open snackbar', () => {
		it('should open snackbar with default values', () => {
			const snackbarSpy = spyOn(snackbarService['_snackbar'], 'open');
			snackbarService.open('Mock Message');
			expect(snackbarSpy).toHaveBeenCalledWith('Mock Message', 'APP.OK', { duration: 7000, panelClass: SnackbarType.INFO });
		});		  

		it('should open snackbar with custom values', () => {
			const snackbarSpy = spyOn(snackbarService['_snackbar'], 'open');
			snackbarService.open('Mock Message', 'Mock Action', SnackbarType.WARNING, 5000);
			expect(snackbarSpy).toHaveBeenCalledWith('Mock Message', 'Mock Action', { duration: 5000, panelClass: SnackbarType.WARNING });
		});
	});
});
