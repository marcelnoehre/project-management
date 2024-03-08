import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectComponent } from './create-project.component';
import { AppModule } from 'src/app/app.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import { TestService } from 'src/app/services/api/test.service';
import { Permission } from 'src/app/enums/permission.enum';

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
				{ provide: MatSnackBar, useValue: snackbarSpy },
				{ provide: ApiService, useClass: TestService }
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

	it('should create a project', async () => {
		component['_user'].token = 'owner';
		component.projectForm.controls['projectFormControl'].setValue('MockProject');
		await component.processCreateProject();
		expect(component['_user'].token).toBe('owner');
		expect(component['_user'].project).toBe('MockProject');
		expect(component['_user'].permission).toBe(Permission.OWNER);
		expect(component['_user'].isLoggedIn).toBe(true);
		expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.CREATE_PROJECT', 'APP.OK', { duration: 7000, panelClass: 'info' });
	});
});
