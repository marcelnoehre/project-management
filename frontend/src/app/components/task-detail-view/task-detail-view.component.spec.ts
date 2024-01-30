import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailViewComponent } from './task-detail-view.component';

describe('TaskDetailViewComponent', () => {
  let component: TaskDetailViewComponent;
  let fixture: ComponentFixture<TaskDetailViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskDetailViewComponent]
    });
    fixture = TestBed.createComponent(TaskDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
