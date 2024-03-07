import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsFeedComponent } from './notifications-feed.component';
import { AppModule } from 'src/app/app.module';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api/api.service';
import { TestService } from 'src/app/services/api/test.service';

describe('NotificationsFeedComponent', () => {
	const notifications = [
		{
			uid: 'lPMZOH0Hxy6z0mhZ9shV',
			message: 'NOTIFICATIONS.NEW.JOINED',
			data: ['admin'],
			icon: 'person_add',
			timestamp: 1707948598239,
			seen: false,
		},
		{
			uid: 'lk8id9WVL0N1o97vRDK6',
			message: 'NOTIFICATIONS.NEW.CREATE_TASK',
			data: ['admin', 'mock'],
			icon: 'note_add',
			timestamp: 1707948640062,
			seen: true,
		},
	];
	let component: NotificationsFeedComponent;
	let fixture: ComponentFixture<NotificationsFeedComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [NotificationsFeedComponent],
			providers: [
				{ provide: ApiService, useClass: TestService }
			]
		});
		fixture = TestBed.createComponent(NotificationsFeedComponent);
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

	describe('seen and remove', () => {
		it('should update seen state', () => {
			component.notifications = [...notifications];
			component.seen(0, 'lPMZOH0Hxy6z0mhZ9shV');
			expect(component['_updateSeen']).toEqual(['lPMZOH0Hxy6z0mhZ9shV']);
		});

		it('should not update seen state', () => {
			component.notifications = [...notifications];
			component.seen(1, 'lk8id9WVL0N1o97vRDK6');
			expect(component['_updateSeen']).toEqual([]);
		});

		it('should update remove state', () => {
			component.notifications = [...notifications];
			component.remove(0, 'lPMZOH0Hxy6z0mhZ9shV');
			expect(component['_updateRemove']).toEqual(['lPMZOH0Hxy6z0mhZ9shV']);
		});
	});

	describe('isNew', () => {
		it('should be new', () => {
			expect(component.isNew(false)).toBe('new');
		});

		it('should not be new', () => {
			expect(component.isNew(true)).toBe('');
		});
	});
});
