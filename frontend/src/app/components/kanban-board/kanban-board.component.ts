import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/interfaces/state';
import { ApiService } from 'src/app/services/api/api.service';
import { TaskState } from 'src/app/enums/task-state.enum';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {
  taskList: State[] = [];
  stateList: string[] = [TaskState.NO_STATUS, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE];

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

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

}
