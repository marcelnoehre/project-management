import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { AppModule } from 'src/app/app.module';
import { environment } from 'src/environments/environment';

describe('RegistrationComponent', () => {
	let component: RegistrationComponent;
	let fixture: ComponentFixture<RegistrationComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [RegistrationComponent]
		});
		fixture = TestBed.createComponent(RegistrationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should load test environment', () => {
		expect(environment.environement).toBe('test');
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
