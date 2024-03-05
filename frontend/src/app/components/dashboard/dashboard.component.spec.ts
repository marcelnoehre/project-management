import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { environment } from 'src/environments/environment';
import { AppModule } from 'src/app/app.module';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { ROUTES, Router, RouterModule } from '@angular/router';

describe('DashboardComponent', () => {
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
	let component: DashboardComponent;
	let fixture: ComponentFixture<DashboardComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AppModule, RouterModule.forRoot(mockRoutes)],
			declarations: [DashboardComponent],
			providers: [
				{ provide: ROUTES, multi: true, useValue: [] }
			]
		});
		fixture = TestBed.createComponent(DashboardComponent);
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
	});

	it('should redirect the user', fakeAsync(() => {
		component.redirectTo('/task/create');
		tick();
		expect(router.url).toBe('/task/create');
	}));
});
