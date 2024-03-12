import { TestBed } from '@angular/core/testing';

import { ParserService } from './parser.service';
import { environment } from 'src/environments/environment';
import { TaskState } from '../enums/task-state.enum';

describe('ParserService', () => {
	const stateList = [
		{ 
			state: TaskState.NONE, 
			tasks: [{ title: 'Task 1', description: 'Description 1', author: 'Author 1', assigned: 'Assigned 1', state: TaskState.NONE, uid: 'mockUid', project: 'mockProject', order: 1, history: [] }]
		}, { 
			state: TaskState.TODO, 
			tasks: [{ title: 'Task 2', description: 'Description 2', author: 'Author 2', assigned: 'Assigned 2', state: TaskState.TODO, uid: 'mockUid', project: 'mockProject', order: 1, history: [] }]
		}, { state: TaskState.PROGRESS, tasks: [] },
		{ state: TaskState.REVIEW, tasks: [] },
		{ state: TaskState.DONE, tasks: [] }
	];
	let parserService: ParserService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		parserService = TestBed.inject(ParserService);
	});

	describe('setup', () => {
		it('should be created', () => {
			expect(parserService).toBeTruthy();
		});
	
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	});

	it('should parse statelist to export format', () => {
		const exportObject = parserService.exportFormat(stateList);
		const expectedObject = [
			{
				title: 'Task 1', 
				description: 'Description 1', 
				author: 'Author 1', 
				assigned: 'Assigned 1', 
				state: TaskState.NONE,
				order: 1
			}, {
				title: 'Task 2', 
				description: 'Description 2', 
				author: 'Author 2', 
				assigned: 'Assigned 2', 
				state: TaskState.TODO,
				order: 1
			}
		];		
		expect(exportObject).toEqual(expectedObject);
	});
	
	it('should generate hash for given string', async () => {
		const result = await parserService.sha256('mock');
		expect(result).toBe('ec864fe99b539704b8872ac591067ef22d836a8d942087f2dba274b301ebe6e5');
	});
});
