import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { TranslateService } from '@ngx-translate/core';
import { AppModule } from 'src/app/app.module';
import { ApiService } from 'src/app/services/api/api.service';
import { environment } from 'src/environments/environment';

class ApiMock { }

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [LoginComponent],
      providers: [
				{ provide: TranslateService, useClass: TranslateService },
        { provide: ApiService, useClass: ApiMock }
			]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load test environment', () => {
		expect(environment.selectedApi).toBe('test');
	});

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
