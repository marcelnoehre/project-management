import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBoardComponent } from './kanban-board.component';
import { environment } from 'src/environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from 'src/app/app.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import { TestService } from 'src/app/services/api/test.service';
import { TaskState } from 'src/app/enums/task-state.enum';
import { TaskStateColor } from 'src/app/enums/task-state-color.enum';

describe('KanbanBoardComponent', () => {
	let component: KanbanBoardComponent;
	let fixture: ComponentFixture<KanbanBoardComponent>;
	let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

	beforeEach(() => {
		snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, TranslateModule.forRoot(), AppModule],
			declarations: [KanbanBoardComponent],
			providers: [
				{ provide: TranslateService, useClass: TranslateService },
				{ provide: ApiService, useClass: TestService },
				{ provide: MatSnackBar, useValue: snackbarSpy }
			]
		});
		fixture = TestBed.createComponent(KanbanBoardComponent);
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

		it('should initialize data', () => {
			expect(component['_targets']).toEqual([TaskState.NONE, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE, TaskState.DELETED]);
			expect(component.stateList).toEqual([TaskState.NONE, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE, TaskState.DELETED]);
			expect(component.taskList).toEqual([]);
			expect(component.loadingDelete).toBe(false);
		});

		it('should initalize taskList', async () => {
			await component.ngAfterViewInit();
			expect(component.taskList).not.toEqual([]);
		});
	});

	describe('drop', () => {
		it('should do nothing for invalid area', async () => {
			const event = { event: { target: { id: 'invalid' } } };
			await component.drop(event);
			expect(snackbarSpy.open).not.toHaveBeenCalled();
		});

		it('should move task to trashBin', async () => {
			const event = { 
				event: { 
					target: { id: TaskState.DELETED }
				},
				previousIndex: 0,
				previousContainer: {
					data: ['uid']
				}
			};
			await component.drop(event);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.MOVE_TO_TRASH', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});

		it('should notify about the invalid section', async () => {
			component['_user'].token = 'owner';
			const event = { 
				event: { 
					target: { id: TaskState.TODO }
				},
				previousIndex: 0,
				currentIndex: 1,
				previousContainer: {
					data: ['uid']
				}
			};
			await component.drop(event);
			expect(snackbarSpy.open).toHaveBeenCalledWith('ERROR.NO_VALID_SECTION', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});
	});

	it('should return the color', () => {
		expect(component.getColor('TODO')).toBe(TaskStateColor.TODO);
	});
});
