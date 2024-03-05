import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerIconComponent } from './spinner-icon.component';
import { AppModule } from 'src/app/app.module';
import { environment } from 'src/environments/environment';

describe('SpinnerIconComponent', () => {
	let component: SpinnerIconComponent;
	let fixture: ComponentFixture<SpinnerIconComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [SpinnerIconComponent]
		});
		fixture = TestBed.createComponent(SpinnerIconComponent);
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
});
