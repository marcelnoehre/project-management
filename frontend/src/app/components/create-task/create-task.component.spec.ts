import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaskComponent } from './create-task.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { MockUserService } from 'src/app/mocks/user-mock.service';

describe('CreateTaskComponent', () => {
  let component: CreateTaskComponent;
  let fixture: ComponentFixture<CreateTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, TranslateModule.forRoot()],
      declarations: [CreateTaskComponent],
      providers: [
        { provide: TranslateService, useClass: TranslateService },
        { provide: UserService, useClass: MockUserService }
      ]
    });
    fixture = TestBed.createComponent(CreateTaskComponent);
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
