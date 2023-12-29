import { AfterViewInit, Component } from '@angular/core';
import { State } from 'src/app/interfaces/data/state';
import { ApiService } from 'src/app/services/api/api.service';
import { TaskState } from 'src/app/enums/task-state.enum';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { TaskStateColor } from 'src/app/enums/task-state-color.enum';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements AfterViewInit {
  taskList: State[] = [];
  stateList: string[] = [TaskState.NONE, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE];

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private router: Router,
    private snackbar: SnackbarService,
    private translate: TranslateService,
    private permission: PermissionService
  ) {

  }

  async ngAfterViewInit(): Promise<void> {
    while (this.permission.getProject() === undefined) await new Promise<void>(done => setTimeout(() => done(), 5));
    const user = this.getUser();
    this.api.getTaskList(user.token, this.permission.getProject()).subscribe(
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

	private getUser(): any {
		return this.storage.getSessionEntry('user');
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

    console.log(event.previousIndex, event.currentIndex, event.event.target.id);

    const foundState = this.taskList.find((list) => list.state === event.event.target.id);
    const order = (foundState!.tasks[event.currentIndex - 1].order + foundState!.tasks[event.currentIndex + 1].order) / 2;
    this.api.updatePosition(this.getUser().token, this.permission.getProject(), foundState!.tasks[event.currentIndex].uid, foundState!.state, order).subscribe(
      (tasklist) => {
        this.taskList = tasklist;
      },
      (error) => {
        this.snackbar.open(this.translate.instant(error.error.message));
      }
    );
        
    
  }

  getColor(state: string) {
    return TaskStateColor[state as keyof typeof TaskStateColor];
  }

}
