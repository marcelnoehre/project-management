import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/interfaces/state';
import { ApiService } from 'src/app/services/api/api.service';
import { TaskState } from 'src/app/enums/task-state.enum';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {
  taskList: State[] = [];
  stateList: string[] = [TaskState.NO_STATUS, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE];

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private router: Router,
    private snackbar: SnackbarService,
    private translate: TranslateService
  ) {

  }

  ngOnInit(): void {
    this.api.getTaskList().subscribe(
      (taskList) => {
        this.taskList = taskList;         
      },
      (error) => {
        if (error.status === 403) {
          this.storage.clearSession();
          this.router.navigateByUrl('/login');
        }
        this.snackbar.open(this.translate.instant(error.error.message));
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
