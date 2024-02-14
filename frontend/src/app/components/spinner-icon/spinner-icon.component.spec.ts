import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerIconComponent } from './spinner-icon.component';
import { AppModule } from 'src/app/app.module';

describe('SpinnerIconComponent', () => {
  let component: SpinnerIconComponent;
  let fixture: ComponentFixture<SpinnerIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [SpinnerIconComponent]
    });
    fixture = TestBed.createComponent(SpinnerIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
