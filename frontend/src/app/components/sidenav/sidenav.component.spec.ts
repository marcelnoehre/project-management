import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { AppModule } from 'src/app/app.module';
import { environment } from 'src/environments/environment';
import { AppIcon } from 'src/app/enums/app-icon.enum';
import { AppItem } from 'src/app/enums/app-item.enum';
import { AppRoute } from 'src/app/enums/app-route.enum';
import { Router, RouterModule, ROUTES } from '@angular/router';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

describe('SidenavComponent', () => {
	const mockRoutes = [
		{
			path: '',
			component: DashboardComponent
		},
		{
			path: 'task/create',
			component: CreateTaskComponent
		}
	];
	let router: Router;
	let component: SidenavComponent;
	let fixture: ComponentFixture<SidenavComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AppModule, RouterModule.forRoot(mockRoutes)],
			declarations: [SidenavComponent],
			providers: [
				{ provide: ROUTES, multi: true, useValue: [] }
			]
		});
		fixture = TestBed.createComponent(SidenavComponent);
		router = TestBed.inject(Router);
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
			expect(component.isExpanded).toBe(false);
			expect(component.appItems).toEqual([
				{ name: AppItem.DASHBOARD, route: AppRoute.DASHBOARD, icon: AppIcon.DASHBOARD },
				{ name: AppItem.CREATE_TASK, route: AppRoute.CREATE_TASK, icon: AppIcon.CREATE_TASK },
				{ name: AppItem.BOARD, route: AppRoute.BOARD, icon: AppIcon.BOARD },
				{ name: AppItem.IMPORT_TASKS, route: AppRoute.IMPORT_TASKS, icon: AppIcon.IMPORT_TASKS },
				{ name: AppItem.TRASH_BIN, route: AppRoute.TRASH_BIN, icon: AppIcon.TRASH_BIN },
				{ name: AppItem.STATS, route: AppRoute.STATS, icon: AppIcon.STATS }
			]);
		});
	});

	describe('checks', () => {
		it('should open the sidenav', () => {
			component.toggleSidebar(true);
			expect(component.isExpanded).toBe(true);
		});

		it('should close the sidenav', () => {
			component.toggleSidebar(false);
			expect(component.isExpanded).toBe(false);
		});

		it('should toggle the sidenav', () => {
			component.toggleSidebar();
			expect(component.isExpanded).toBe(true);
			component.toggleSidebar();
			expect(component.isExpanded).toBe(false);
		});

		it('should be logged in', () => {
			component['_user'].isLoggedIn = true;
			component['_user'].project = 'mock';
			expect(component.isLoggedIn()).toBe(true);
		});

		it('should not be logged in', () => {
			component['_user'].isLoggedIn = false;
			component['_user'].project = 'mock';
			expect(component.isLoggedIn()).toBe(false);
			component['_user'].isLoggedIn = true;
			component['_user'].project = '';
			expect(component.isLoggedIn()).toBe(false);
		});
	});

	it('should redirect the user', fakeAsync(() => {
		component.redirectTo('/task/create');
		tick();
		expect(router.url).toBe('/task/create');
	}));
});
