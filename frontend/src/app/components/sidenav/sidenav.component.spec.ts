import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { AppModule } from 'src/app/app.module';
import { environment } from 'src/environments/environment';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [SidenavComponent]
    });
    fixture = TestBed.createComponent(SidenavComponent);
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
