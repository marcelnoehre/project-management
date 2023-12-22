import { Component, OnInit } from '@angular/core';
import { TaskStateColor } from 'src/app/enums/task-state-color.enum';
import { TaskState } from 'src/app/enums/task-state.enum';
import { Task } from 'src/app/interfaces/data/task';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {
  taskStates = [TaskState.NO_STATUS, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE];
  stateColors = [TaskStateColor.NO_STATUS, TaskStateColor.TODO, TaskStateColor.PROGRESS, TaskStateColor.REVIEW, TaskStateColor.DONE];
  taskList: Task[] = [];

  constructor(
    private api: ApiService
  ) {

  }

  ngOnInit(): void {
    this.api.getTaskList().subscribe(
      (taskList) => {
        this.taskList = taskList;            
      }
    );
  }

}
