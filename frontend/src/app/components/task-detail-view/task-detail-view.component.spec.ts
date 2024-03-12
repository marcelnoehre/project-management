import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailViewComponent } from './task-detail-view.component';
import { AppModule } from 'src/app/app.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { TaskState } from 'src/app/enums/task-state.enum';
import { ApiService } from 'src/app/services/api/api.service';
import { TestService } from 'src/app/services/api/test.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('TaskDetailViewComponent', () => {
	const task = {
		uid: 'DHfqbZ18jhH55SFWFGwO',
		title: 'MockTitle',
		description: 'MockDescroption',
		project: 'MockProject',
		author: 'owner',
		assigned: '',
		state: TaskState.TODO,
		history: [],
		order: 1
	};
	let component: TaskDetailViewComponent;
	let fixture: ComponentFixture<TaskDetailViewComponent>;
	let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

	beforeEach(() => {
		snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [TaskDetailViewComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} },
				{ provide: ApiService, useClass: TestService },
				{ provide: ApiService, useClass: TestService },
				{ provide: MatSnackBar, useValue: snackbarSpy },
				{ provide: MAT_DIALOG_DATA, useValue: {} }
			]
		});
		fixture = TestBed.createComponent(TaskDetailViewComponent);
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

		it('should initialize data', async () => {
			component['_data'] = task;
			await component.ngOnInit();
			expect(component.members).not.toEqual([]);
		});
	});

	describe('submit', () => {
		it('should disable submit', async () => {
			component['_data'] = task;
			await component.ngOnInit();
			expect(component.disableSubmit()).toBe(true);
		});

		it('should enable submit for another title', async () => {
			component['_data'] = task;
			await component.ngOnInit();
			component.task.title = 'mock';
			expect(component.disableSubmit()).toBe(false);
		});

		it('should enable submit for another description', async () => {
			component['_data'] = task;
			await component.ngOnInit();
			component.task.description = 'mock';
			expect(component.disableSubmit()).toBe(false);
		});

		it('should enable submit for another assigned user', async () => {
			component['_data'] = task;
			await component.ngOnInit();
			component.task.assigned = 'mock';
			expect(component.disableSubmit()).toBe(false);
		});
	});

	it('should update the taskDeatails', async () => {
		component['_user'].token = 'owner';
		component.task = task;
		await component.updateTaskDetails();
		expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.EDIT_TASK', 'APP.OK', { duration: 7000, panelClass: 'info' });
	});
});
