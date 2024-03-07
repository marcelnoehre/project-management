import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectComponent } from './create-project.component';
import { AppModule } from 'src/app/app.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('CreateProjectComponent', () => {
	let component: CreateProjectComponent;
	let fixture: ComponentFixture<CreateProjectComponent>;
	let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

	beforeEach(() => {
		snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [CreateProjectComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} },
				{ provide: MAT_DIALOG_DATA, useValue: {} },
				{ provide: MatSnackBar, useValue: snackbarSpy }
			]
		});
		fixture = TestBed.createComponent(CreateProjectComponent);
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

	describe('formcontrol', () => {
		it('should create projectForm', () => {
			expect(component.projectForm).toBeDefined();
		});

		it('should create projectForm with projectFormControl', () => {
			expect(component.projectForm.get('projectFormControl')).toBeDefined();
		});

		it('should set validators for projectFormControl', () => {
			const projectErrors = component.projectForm.get('projectFormControl')?.errors;
			const isProjectRequired = projectErrors?.['required'];
			expect(isProjectRequired).toBeTruthy();
		});

		it('should return the correct project value', () => {
			component.projectForm.get('projectFormControl')?.setValue('MockProject');	
			const username = component['_project'];
			expect(username).toBe('MockProject');
		});

		it('should check if project is invalid', () => {
			expect(component.projectValid()).toBeFalsy();
		});

		it('should check if project is valid', () => {
			component.projectForm.controls['projectFormControl'].setValue('validProject');
			expect(component.projectValid()).toBeTruthy();
		});
	});
});
