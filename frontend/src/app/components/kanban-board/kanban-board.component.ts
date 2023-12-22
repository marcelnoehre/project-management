import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Task } from 'src/app/interfaces/data/task';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {
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
