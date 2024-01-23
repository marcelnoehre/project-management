import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTasksComponent } from './import-tasks.component';

describe('ImportTasksComponent', () => {
  let component: ImportTasksComponent;
  let fixture: ComponentFixture<ImportTasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportTasksComponent]
    });
    fixture = TestBed.createComponent(ImportTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
