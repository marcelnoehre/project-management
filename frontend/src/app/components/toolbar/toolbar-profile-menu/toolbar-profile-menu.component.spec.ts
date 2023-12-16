import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarProfileMenuComponent } from './toolbar-profile-menu.component';

describe('ToolbarProfileMenuComponent', () => {
  let component: ToolbarProfileMenuComponent;
  let fixture: ComponentFixture<ToolbarProfileMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToolbarProfileMenuComponent]
    });
    fixture = TestBed.createComponent(ToolbarProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
