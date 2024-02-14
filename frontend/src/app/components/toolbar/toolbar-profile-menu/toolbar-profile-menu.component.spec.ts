import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModule } from 'src/app/app.module';
import { ToolbarProfileMenuComponent } from './toolbar-profile-menu.component';
import { environment } from 'src/environments/environment';
import { MockUserService } from 'src/app/mocks/user-mock.service';
import { UserService } from 'src/app/services/user.service';

describe('ToolbarProfileMenuComponent', () => {
  let component: ToolbarProfileMenuComponent;
  let fixture: ComponentFixture<ToolbarProfileMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ToolbarProfileMenuComponent],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    });
    fixture = TestBed.createComponent(ToolbarProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load test environment', () => {
		expect(environment.environement).toBe('test');
	});

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
