import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashBinComponent } from './trash-bin.component';
import { AppModule } from 'src/app/app.module';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api/api.service';
import { TestService } from 'src/app/services/api/test.service';
import { TaskState } from 'src/app/enums/task-state.enum';
import { Permission } from 'src/app/enums/permission.enum';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('TrashBinComponent', () => {
	const taskList = [{
		uid: 'L0LJoChgGLAh36tmUip1',
		author: 'owner',
		project: 'mockProject',
		description: 'Prepare comprehensive documentation for the project, including user manuals and technical guides.',
		assigned: '',
		history: [
			{
				previous: null,
				state: TaskState.NONE,
				timestamp: 1707706984237,
				username: 'owner',
			},
		],
		title: 'Documentation',
		order: 3,
		state: TaskState.DELETED,
	},
	{
		uid: 'dk8n2dxpQoybNkRp9kUE',
		author: 'owner',
		project: 'mockProject',
		description: 'Create a prototype for the new product feature based on the research findings.',
		assigned: '',
		history: [
			{
				previous: null,
				state: TaskState.REVIEW,
				timestamp: 1707706985307,
				username: 'owner',
			},
		],
		title: 'Develop Prototype',
		order: 3,
		state: TaskState.DELETED,
	},
	{
		uid: 'enm3q1D8bm0RuzYIFCjI',
		author: 'owner',
		project: 'mockProject',
		description: 'Conduct market research to identify current trends and customer preferences.',
		assigned: '',
		history: [
			{
				previous: null,
				state: TaskState.PROGRESS,
				timestamp: 1707706984989,
				username: 'owner',
			},
		],
		title: 'Research Market Trends',
		order: 3,
		state: TaskState.DELETED,
	},
	{
		uid: 'TcxyseGyDpgTPPYHRn1l',
		author: 'owner',
		project: 'mockProject',
		description: 'Gather feedback on the prototype and make necessary revisions to the user interface.',
		assigned: '',
		history: [
			{
				previous: null,
				state: TaskState.TODO,
				timestamp: 1707706984701,
				username: 'owner',
			},
		],
		title: 'Revise User Interface',
		order: 5,
		state: TaskState.DELETED,
	}
	];
	let snackbarSpy: jasmine.SpyObj<MatSnackBar>;
	let component: TrashBinComponent;
	let fixture: ComponentFixture<TrashBinComponent>;

	beforeEach(() => {
		snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [TrashBinComponent],
			providers: [
				{ provide: ApiService, useClass: TestService },
				{ provide: TranslateService, useClass: TranslateService },
				{ provide: MatSnackBar, useValue: snackbarSpy }
			]
		});
		fixture = TestBed.createComponent(TrashBinComponent);
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

		it('should initialize tasks', async () => {
			component['_user'].token = 'owner';
			component['_user'].project = 'mock';
			await component.ngAfterViewInit();
			expect(component.taskList).toEqual(taskList);
		});
	});

	describe('checks', () => {
		it('should disable delete', () => {
			component['_user'].permission = Permission.MEMBER;
			expect(component.disableDelete()).toBe(true);
		});

		it('should not disable delete', () => {
			component['_user'].permission = Permission.ADMIN;
			expect(component.disableDelete()).toBe(false);
		});

		it('should show clear', () => {
			component['_user'].permission = Permission.ADMIN;
			expect(component.showClear()).toBe(true);
		});

		it('should not show clear', () => {
			component['_user'].permission = Permission.MEMBER;
			expect(component.showClear()).toBe(false);
		});

		it('should disable clear', () => {
			expect(component.disableClear()).toBe(true);
		});

		it('should not disable clear', async () => {
			await component.ngAfterViewInit();
			expect(component.disableClear()).toBe(false);
		});

		it('should load restore', () => {
			component['_loadingRestore'] = 'mock';
			expect(component.restoreLoading('mock')).toBe(true);
		});

		it('should not load restore', () => {
			expect(component.restoreLoading('mock')).toBe(false);
		});

		it('should load delete', () => {
			component['_loadingDelete'] = 'mock';
			expect(component.deleteLoading('mock')).toBe(true);
		});

		it('should not load delete', () => {
			expect(component.deleteLoading('mock')).toBe(false);
		});
	});

	it('should restore a task', async () => {
		component['_user'].token = 'owner';
		await component.ngAfterViewInit();
		await component.restore('L0LJoChgGLAh36tmUip1', 'Documentation');
		expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.TASK_RESTORED', 'APP.OK', { duration: 7000, panelClass: 'info' });
	});

	it('should delete a task', async () => {
		component['_user'].token = 'owner';
		await component.ngAfterViewInit();
		await component.delete('L0LJoChgGLAh36tmUip1', 'Documentation');
		expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.TASK_DELETED', 'APP.OK', { duration: 7000, panelClass: 'info' });

	});

	it('should clear trash bin', async () => {
		component['_user'].token = 'owner';
		await component.ngAfterViewInit();
		await component.clear();
		expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.CLEAR_TRASH_BIN', 'APP.OK', { duration: 7000, panelClass: 'info' });
	});
});
