import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';
import { AppModule } from 'src/app/app.module';
import { environment } from 'src/environments/environment';

describe('ToolbarComponent', () => {
	let component: ToolbarComponent;
	let fixture: ComponentFixture<ToolbarComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [ToolbarComponent]
		});
		fixture = TestBed.createComponent(ToolbarComponent);
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
