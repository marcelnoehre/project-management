import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModule } from 'src/app/app.module';
import { ToolbarProfileMenuComponent } from './toolbar-profile-menu.component';
import { environment } from 'src/environments/environment';

describe('ToolbarProfileMenuComponent', () => {
  let component: ToolbarProfileMenuComponent;
  let fixture: ComponentFixture<ToolbarProfileMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ToolbarProfileMenuComponent]
    });
    fixture = TestBed.createComponent(ToolbarProfileMenuComponent);
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
