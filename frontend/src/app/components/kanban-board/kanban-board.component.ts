import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/interfaces/data/state';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {
  taskList: State[] = [];

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
