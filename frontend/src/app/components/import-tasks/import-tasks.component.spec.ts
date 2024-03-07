import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTasksComponent } from './import-tasks.component';
import { AppModule } from 'src/app/app.module';
import { TaskState } from 'src/app/enums/task-state.enum';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import { TestService } from 'src/app/services/api/test.service';

describe('ImportTasksComponent', () => {
	const taskList = [{
		uid: 'DHfqbZ18jhH55SFWFGwO',
		author: 'mock',
		project: 'MockProject',
		title: 'MockTitle',
		description: 'MockDescription',
		assigned: '',
		state: TaskState.TODO,
		order: 1,
		history: []
	}];
	let component: ImportTasksComponent;
	let fixture: ComponentFixture<ImportTasksComponent>;
	let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

	beforeEach(() => {
		snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [ImportTasksComponent],
			providers: [
				{ provide: ApiService, useClass: TestService },
				{ provide: MatSnackBar, useValue: snackbarSpy }
			]
		});
		fixture = TestBed.createComponent(ImportTasksComponent);
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

	describe('handle task list', () => {
		it('should have a taskList', () => {
			component.taskList = taskList;
			expect(component.hasTaskList()).toBe(true);
		});

		it('should have no taskList', () => {
			expect(component.hasTaskList()).toBe(false);
		});
	});

	describe('import tasks', () => {
		it('should import tasks', async () => {
			component['_user'].token = 'owner';
			component.taskList = taskList;
			await component.importTasks();
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.IMPORT_TASKS', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});

		it('should update the result', async () => {
			component['_user'].token = 'owner';
			component.taskList = taskList;
			await component.importTasks();
			expect(component.result).toEqual({ 
				amount: 11, 
				success: 11, 
				fail: 0,
				taskList: [
					{ title: 'Documentation', description: 'Prepare comprehensive documentation for the project, including user manuals and technical guides.', state: TaskState.NONE, author: 'mock' },
					{ title: 'Finalize Project', description: 'Review all aspects of the project and prepare for the final release.', state: TaskState.NONE,author: 'mock' },
					{ title: 'Complete Project Proposal', description: 'Draft a detailed project proposal outlining goals, scope, and deliverables.', state: TaskState.TODO,author: 'mock' },
					{ title: 'Revise User Interface', description: 'Gather feedback on the prototype and make necessary revisions to the user interface.', state: TaskState.TODO,author: 'mock' },
					{ title: 'Client Presentation', description: 'Prepare a presentation for the client showcasing the project progress and features.', state: TaskState.TODO, author: 'mock' },
					{ title: 'Research Market Trends', description: 'Conduct market research to identify current trends and customer preferences.', state: TaskState.PROGRESS, author: 'mock' },
					{ title: 'Code Refactoring', description: 'Optimize and refactor existing codebase to improve performance and maintainability.', state: TaskState.PROGRESS,author: 'mock' },
					{ title: 'Develop Prototype', description: 'Create a prototype for the new product feature based on the research findings.', state: TaskState.REVIEW,author: 'mock' },
					{ title: 'Quality Assurance Testing', description: 'Conduct thorough testing to ensure the product meets quality standards.', state: TaskState.REVIEW,author: 'mock' },
					{ title: 'Project Kickoff', description: 'Hold a meeting to officially start the project.', state: TaskState.DONE, author: 'mock' },
					{ title: 'Release Version 1.0', description: 'Publish the final version of the product.', state: TaskState.DONE, author: 'mock' }
				]
			});
		});

		it('should reset imported data', async () => {
			component['_user'].token = 'owner';
			component.taskList = taskList;
			await component.importTasks();
			component.reset();
			expect(component.taskList).toEqual([]);
			expect(component.result).toEqual(null);
		});
	});


});
