import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModule } from 'src/app/app.module';
import { ToolbarProfileMenuComponent } from './toolbar-profile-menu.component';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Permission } from 'src/app/enums/permission.enum';
import { LoginComponent } from '../../login/login.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ROUTES, Router, RouterModule } from '@angular/router';

describe('ToolbarProfileMenuComponent', () => {
	const mockRoutes = [
		{
			path: '',
			component: DashboardComponent
		},
		{
			path: 'login',
			component: LoginComponent
		}
	];
	const user = {
		token: 'owner',
		username: 'owner',
		fullName: 'Mock Owner',
		initials: 'MO',
		color: '#FFFFFF',
		language: 'en',
		project: 'MockProject',
		permission: Permission.OWNER,
		profilePicture: '',
		notificationsEnabled: true,
		isLoggedIn: true,
		stats: {
			created: 91,
			imported: 10,
			updated: 45,
			edited: 78,
			trashed: 32,
			restored: 57,
			deleted: 23,
			cleared: 69,
		},
	}
	let component: ToolbarProfileMenuComponent;
	let fixture: ComponentFixture<ToolbarProfileMenuComponent>;
	let router: Router;
	let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

	beforeEach(() => {
		snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
		TestBed.configureTestingModule({
			imports: [AppModule, RouterModule.forRoot(mockRoutes)],
			declarations: [ToolbarProfileMenuComponent],
			providers: [
				{ provide: ROUTES, multi: true, useValue: [] },
				{ provide: MatSnackBar, useValue: snackbarSpy }
			]
		});
		fixture = TestBed.createComponent(ToolbarProfileMenuComponent);
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

	it('should initialize default user data', async () => {
		expect(component.fullName).toBe('');
		expect(component.profilePicture).toBe('');
		expect(component.initials).toBe('');
		expect(component.color).toBe('');
	});

	describe('logout', () => {
		it('should clear the user data', () => {
			component['_user'].user = user;
			component.logout();
			expect(component['_user'].user).not.toEqual(user);
		});

		it('should show the logout snackbar', () => {
			component['_user'].user = user;
			component.logout();
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.LOGOUT', 'APP.OK', Object({ duration: 7000, panelClass: 'info' }));
		});

		it('should show the logout snackbar', async () => {
			component['_user'].user = user;
			await component.logout();
			expect(router.url).toBe('/login');
		});
	});

	describe('show notifications', () => {
		it('should show the notifications ui', () => {
			component['_user'].notificationsEnabled = true;
			expect(component.showNotifications()).toBe(true);
		});

		it('should not show the notifications ui', () => {
			component['_user'].notificationsEnabled = false;
			expect(component.showNotifications()).toBe(false);
		});
	});
});
