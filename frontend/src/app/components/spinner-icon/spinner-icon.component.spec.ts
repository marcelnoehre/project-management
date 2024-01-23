import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerIconComponent } from './spinner-icon.component';

describe('SpinnerIconComponent', () => {
  let component: SpinnerIconComponent;
  let fixture: ComponentFixture<SpinnerIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
