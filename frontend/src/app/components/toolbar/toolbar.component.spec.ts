import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';
import { AppModule } from 'src/app/app.module';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ToolbarComponent', () => {
	let component: ToolbarComponent;
	let fixture: ComponentFixture<ToolbarComponent>;
	let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

	beforeEach(() => {
		snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [ToolbarComponent],
			providers: [
				{ provide: MatSnackBar, useValue: snackbarSpy }
			]
		});
		fixture = TestBed.createComponent(ToolbarComponent);
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

	it('should toggle sidenav on button click', () => {
		spyOn(component.sidenavClickEvent, 'emit');
		component.toggleSidenav();
		expect(component.sidenavClickEvent.emit).toHaveBeenCalled();
	});

	describe('notifications', () => {
		it('should turn notifications off', async () => {
			component.notificationsEnabled = true;
			await component.toggleNotifcations();
			expect(component['_user'].notificationsEnabled).toBe(false);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.NOTIFICATIONS_OFF', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});

		it('should turn notifications on', async () => {
			component.notificationsEnabled = false;
			await component.toggleNotifcations();
			expect(component['_user'].notificationsEnabled).toBe(true);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.NOTIFICATIONS_ON', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});
	});

	describe('is logged in', () => {
		it('should update notifications state', () => {
			component['_user'].notificationsEnabled = true;
			component.isLoggedIn()
			expect(component.notificationsEnabled).toBe(true);
			component['_user'].notificationsEnabled = false;
			component.isLoggedIn()
			expect(component.notificationsEnabled).toBe(false);
		});

		it('should verify logged in user', () => {
			component['_user'].isLoggedIn = true;
			component['_user'].project = 'mock';
			expect(component.isLoggedIn()).toBe(true);
		});

		it('should block not logged in user', () => {
			component['_user'].isLoggedIn = false;
			component['_user'].project = 'mock';
			expect(component.isLoggedIn()).toBe(false);
		});

		it('should block user without project', () => {
			component['_user'].isLoggedIn = true;
			component['_user'].project = '';
			expect(component.isLoggedIn()).toBe(false);
		});
	});
});
