import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailViewComponent } from './task-detail-view.component';
import { AppModule } from 'src/app/app.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('TaskDetailViewComponent', () => {
  let component: TaskDetailViewComponent;
  let fixture: ComponentFixture<TaskDetailViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [TaskDetailViewComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(TaskDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
