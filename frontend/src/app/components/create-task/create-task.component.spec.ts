import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaskComponent } from './create-task.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Permission } from 'src/app/enums/permission.enum';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('CreateTaskComponent', () => {
	let component: CreateTaskComponent;
	let fixture: ComponentFixture<CreateTaskComponent>;
	let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

	beforeEach(() => {
		snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
		TestBed.configureTestingModule({
			imports: [AppModule, TranslateModule.forRoot()],
			declarations: [CreateTaskComponent],
			providers: [
				{ provide: TranslateService, useClass: TranslateService },
				{ provide: MatSnackBar, useValue: snackbarSpy }
			]
		});
		fixture = TestBed.createComponent(CreateTaskComponent);
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
		it('should create createTaskForm', () => {
			expect(component.createTaskForm).toBeDefined();
		});

		it('should create createTaskForm with titleFormControl', () => {
			expect(component.createTaskForm.get('titleFormControl')).toBeDefined();
		});

		it('should create createTaskForm with descriptionFormControl', () => {
			expect(component.createTaskForm.get('descriptionFormControl')).toBeDefined();
		});

		it('should create createTaskForm with assignFormControl', () => {
			expect(component.createTaskForm.get('assignFormControl')).toBeDefined();
		});

		it('should create createTaskForm with stateFormControl', () => {
			expect(component.createTaskForm.get('stateFormControl')).toBeDefined();
		});

		it('should set validators for titleFormControl', () => {
			const titleErrors = component.createTaskForm.get('titleFormControl')?.errors;
			const isTitleRequired = titleErrors?.['required'];
			expect(isTitleRequired).toBeTruthy();
		});

		it('should return the correct title value', () => {
			component.createTaskForm.get('titleFormControl')?.setValue('MockTitle');	
			const username = component['_title'];
			expect(username).toBe('MockTitle');
		});

		it('should return the correct description value', () => {
			component.createTaskForm.get('descriptionFormControl')?.setValue('MockDescription');	
			const username = component['_description'];
			expect(username).toBe('MockDescription');
		});

		it('should return the correct assigned user', () => {
			component.createTaskForm.get('assignFormControl')?.setValue('MockAssigned');	
			const username = component['_assigned'];
			expect(username).toBe('MockAssigned');
		});

		it('should return the correct state', () => {
			component.createTaskForm.get('stateFormControl')?.setValue('MockState');	
			const username = component['_state'];
			expect(username).toBe('MockState');
		});

		it('should check if task is invalid', () => {
			expect(component.isValid()).toBeFalsy();
		});

		it('should check if task is valid', () => {
			component.createTaskForm.controls['titleFormControl'].setValue('mock');
			expect(component.isValid()).toBeTruthy();
		});
	});

	it('shoudl initialize the list of team members', async () => {
		component['_user'].token = 'mock';
		await component.ngOnInit();
		expect(component.members.length).toBe(4);
		expect(component.members).toEqual([
			{ token: 'owner', username: 'owner', fullName: 'Mock Owner', initials: 'MO', color: '#FFFFFF', language: 'en', project: 'MockProject', permission: Permission.OWNER, profilePicture: '', notificationsEnabled: true, isLoggedIn: true, stats: { created: 91, imported: 10, updated: 45, edited: 78, trashed: 32, restored: 57, deleted: 23, cleared: 69 } },
			{ token: 'admin', username: 'admin', fullName: 'Mock Admin', initials: 'MA', color: '#FFFFFF', language: 'en', project: 'MockProject', permission: Permission.ADMIN, profilePicture: '', notificationsEnabled: true, isLoggedIn: true, stats: { created: 42, imported: 15, updated: 78, edited: 63, trashed: 29, restored: 51, deleted: 94, cleared: 12 } },
			{ token: 'member', username: 'member', fullName: 'Mock Member', initials: 'MM', color: '#FFFFFF', language: 'de', project: 'mockProject', permission: Permission.MEMBER, profilePicture: '', notificationsEnabled: false, isLoggedIn: true, stats: { created: 64, imported: 27, updated: 89, edited: 14, trashed: 50, restored: 73, deleted: 3, cleared: 67 } },
			{ token: 'invited', username: 'invited', fullName: 'Mock Invited', initials: 'MI', color: '#FFFFFF', language: 'en', project: 'MockProject', permission: Permission.INVITED, profilePicture: '', notificationsEnabled: true, isLoggedIn: true, stats: { created: 77, imported: 42, updated: 19, edited: 56, trashed: 83, restored: 5, deleted: 38, cleared: 91 } }
		]);
	});

	it('should create the project', async () => {
		component.createTaskForm.get('titleFormControl')?.setValue('mock');
		await component.createTask();
		expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.CREATE_TASK', 'APP.OK', { duration: 7000, panelClass: 'info' });
	});
});
