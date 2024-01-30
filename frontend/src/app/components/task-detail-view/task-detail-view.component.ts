import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/app/interfaces/data/task';

@Component({
  selector: 'app-task-detail-view',
  templateUrl: './task-detail-view.component.html',
  styleUrls: ['./task-detail-view.component.scss']
})
export class TaskDetailViewComponent {
  initialTask!: Task;
  task!: Task;

  constructor(
    private dialogRef: MatDialogRef<TaskDetailViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    
  }

  ngOnInit(): void {
    this.task = this.data;
    this.initialTask = this.data;
  }
}
