import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsFeedComponent } from './notifications-feed.component';
import { AppModule } from 'src/app/app.module';

describe('NotificationsFeedComponent', () => {
	let component: NotificationsFeedComponent;
	let fixture: ComponentFixture<NotificationsFeedComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [NotificationsFeedComponent]
		});
		fixture = TestBed.createComponent(NotificationsFeedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
