import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { AppModule } from 'src/app/app.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

describe('DialogComponent', () => {
	let component: DialogComponent;
	let fixture: ComponentFixture<DialogComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [DialogComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} },
				{ provide: MAT_DIALOG_DATA, useValue: {} }
			]
		});
		fixture = TestBed.createComponent(DialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('setup', () => {
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	
		it('should create', () => {
			expect(component).toBeTruthy();
		});
	});

	it('should initialize dialog data', async () => {
		component['_data'] = {
			headline: 'MockHeadline',
			description: 'MockDescription',
			falseButton: 'MockFalse',
			trueButton: 'MockTrue'
		};
		await component.ngOnInit();
		expect(component.headline).toBe('MockHeadline');
		expect(component.description).toBe('MockDescription');
		expect(component.falseButton).toBe('MockFalse');
		expect(component.trueButton).toBe('MockTrue');
	});
	
});
