import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingsComponent } from './project-settings.component';
import { AppModule } from 'src/app/app.module';

describe('ProjectSettingsComponent', () => {
	let component: ProjectSettingsComponent;
	let fixture: ComponentFixture<ProjectSettingsComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [ProjectSettingsComponent]
		});
		fixture = TestBed.createComponent(ProjectSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
