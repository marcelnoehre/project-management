import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsComponent } from './stats.component';
import { AppModule } from 'src/app/app.module';
import { environment } from 'src/environments/environment';
import { TaskStateColor } from 'src/app/enums/task-state-color.enum';
import { TaskState } from 'src/app/enums/task-state.enum';

describe('StatsComponent', () => {
	let component: StatsComponent;
	let fixture: ComponentFixture<StatsComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [StatsComponent]
		});
		fixture = TestBed.createComponent(StatsComponent);
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
			expect(component['_activeUnit']).toBe('h');
			expect(component['_reload']).toEqual({
				all: false,
				personalStats: false,
				stats: false,
				statLeaders: false,
				taskAmount: false,
				averageTime: false,
				wip: false,
				taskProgress: false,
				projectRoadmap: false
			});
			expect(component['_unitFactor']).toEqual({
				ms: 1,
				s: 0.001,
				min: 0.001 / 60,
				h: 0.001 / 3600,
				days: 0.001 / (3600 * 24)
			});
			expect(component.information).toBe('INIT');
			expect(component.mode).toBe('determinate');
			expect(component.loading).toBe(0);
			expect(component.units).toEqual(['ms', 's', 'min', 'h', 'days']);
			expect(component.statLabels).toEqual(['created', 'imported', 'updated', 'edited', 'trashed', 'restored', 'deleted', 'cleared']);
			expect(component.icons).toEqual({
				created: 'add',
				imported: 'upload_file',
				updated: 'view_kanban',
				edited: 'edit',
				trashed: 'delete',
				restored: 'undo',
				deleted: 'delete_forever',
				cleared: 'clear'
			});
			expect(component.data).toEqual({
				optimizeOrder: null,
				personalStats: null,
				stats: null,
				statLeaders: null,
				taskAmount: null,
				averageTime: null,
				wip: null,
				taskProgress: null,
				projectRoadmap: null
			});
			expect(component.barChartOptions).toEqual({
				scaleShowVerticalLines: false,
				responsive: true
			});
			expect(component.chartOptions).toEqual({
				series: [],
				chart: {
					height: 350,
					type: 'area'
				},
				dataLabels: {
					enabled: false
				},
				stroke: {
					curve: 'smooth'
				},
				xaxis: {
					type: 'datetime',
					categories: []
				},
				tooltip: {
					x: {
						format: 'yyyy-MM-dd HH:mm:ss'
					}
				},
				colors: [TaskStateColor.NONE, TaskStateColor.TODO, TaskStateColor.PROGRESS, TaskStateColor.REVIEW, TaskStateColor.DONE],
				fill: {
					type: 'solid',
					colors: [TaskStateColor.NONE, TaskStateColor.TODO, TaskStateColor.PROGRESS, TaskStateColor.REVIEW, TaskStateColor.DONE]
				},
			});
		});
	});

	it('should get task amount data', () => {
		expect(component.taskAmountData()).toEqual({
			data: [
				{
					data: jasmine.any(Array),
					label: 'Task Amount',
					backgroundColor: [
						TaskStateColor.NONE,
						TaskStateColor.TODO,
						TaskStateColor.PROGRESS,
						TaskStateColor.REVIEW,
						TaskStateColor.DONE,
						TaskStateColor.DELETED
					]
				}
			],
			labels: [
				TaskState.NONE,
				TaskState.TODO,
				TaskState.PROGRESS,
				TaskState.REVIEW,
				TaskState.DONE,
				TaskState.DELETED
			]
		});
	});

	it('should get average time data', () => {
		expect(component.averageTimeData()).toEqual({
			data: [
				{
					data: jasmine.any(Array),
					label: 'Task Amount',
					backgroundColor: [
						TaskStateColor.NONE,
						TaskStateColor.TODO,
						TaskStateColor.PROGRESS,
						TaskStateColor.REVIEW
					]
				}
	
			],
			labels: [
				TaskState.NONE,
				TaskState.TODO,
				TaskState.PROGRESS,
				TaskState.REVIEW
			]
		});
	});

	describe('wip', () => {
		it('should display multiple wip', () => {
			component.data.wip = 2;
			expect(component.getWipInfo()).toBe('STATS.WIP_INFO');
		});

		it('should display single wip', () => {
			component.data.wip = 1;
			expect(component.getWipInfo()).toBe('STATS.WIP_INFO_SINGLE');
		});

		it('should display no wip', () => {
			component.data.wip = 0;
			expect(component.getWipInfo()).toBe('STATS.WIP_INFO_NONE');
		});
	});

	describe('unit', () => {
		it('should update the unit', () => {
			component.setUnit('s');
			expect(component['_activeUnit']).toBe('s');
		});

		it('should highlight the unit', () => {
			expect(component.highlightActiveUnit('h')).toBe(true);
		});

		it('should not highlight the unit', () => {
			component.setUnit('s');
			expect(component.highlightActiveUnit('h')).toBe(false);
		});
	});

	describe('load', () => {
		it('should be loaded', () => {
			expect(component.isLoaded()).toBe(false);
		});

		it('should not be loaded', () => {
			component.loading = 100;
			expect(component.isLoaded()).toBe(true);
		});

		it('should not be loading stat', () => {
			component['_reload'].optimizeOrder = false;
			expect(component.isLoading('optimizeOrder')).toBe(false);
		});

		it('should be loading stat', () => {
			component['_reload'].optimizeOrder = true;
			expect(component.isLoading('optimizeOrder')).toBe(true);
		});
	});
});
