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
import { UserService } from 'src/app/services/user.service';
import { ParserService } from 'src/app/services/parser.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailViewComponent } from '../task-detail-view/task-detail-view.component';
import { Task } from 'src/app/interfaces/data/task';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements AfterViewInit {
  taskList: State[] = [];
  stateList: string[] = [TaskState.NONE, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE, TaskState.DELETED];
  loadingDelete: boolean = false;

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private router: Router,
    private snackbar: SnackbarService,
    private translate: TranslateService,
    private user: UserService,
    private parser: ParserService,
    private dialog: MatDialog,
    private _error: ErrorService
  ) {

  }

  async ngAfterViewInit(): Promise<void> {
    while (this.user.project === undefined) await new Promise<void>(done => setTimeout(() => done(), 5));
    this.api.getTaskList(this.user.token).subscribe(
      (taskList) => {
        this.taskList = taskList;        
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }

  drop(event: any) {
    try {
      const targets = [TaskState.NONE, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE, TaskState.DELETED];
      if (!targets.includes(event.event.target.id)) {
        return;
      }
      if (event.event.target.id === TaskState.DELETED) {
        this.loadingDelete = true;
        this.api.moveToTrashBin(this.user.token, event.previousContainer.data[event.previousIndex].uid).subscribe(
          (tasklist) => {
            this.loadingDelete = false;
            this.taskList = tasklist;
            this.snackbar.open(this.translate.instant('SUCCESS.MOVE_TO_TRASH'));
          },
          (error) => {
            this.loadingDelete = false;
            this._error.handleApiError(error);
          }
        );
        return;
      }      
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
      const foundState = this.taskList.find((list) => list.state === event.event.target.id);
      const previousIndex = foundState!.tasks[event.currentIndex - 1]?.order ? foundState!.tasks[event.currentIndex - 1].order : 0;
      const nextIndex = foundState!.tasks[event.currentIndex + 1]?.order === undefined ? previousIndex + 2 : foundState!.tasks[event.currentIndex + 1].order;
      this.api.updatePosition(this.user.token, foundState!.tasks[event.currentIndex].uid, foundState!.state, (previousIndex + nextIndex) / 2).subscribe(
        (tasklist) => {
          this.taskList = tasklist;
        },
        (error) => {
          this._error.handleApiError(error);
        }
      );
    } catch (err) {
      this.snackbar.open(this.translate.instant('ERROR.NO_VALID_SECTION'));
    }
  }

  getColor(state: string) {
    return TaskStateColor[state as keyof typeof TaskStateColor];
  }

  json() {
    this.export(this.parser.statesToJSON(this.taskList), '.json');
  }

  xml() {
    this.export(this.parser.statesToXML(this.taskList), '.xml');
  }

  yaml() {
    this.export(this.parser.statesToYAML(this.taskList), '.yaml');
  }

  export(blob: Blob, fileExtension: string) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'export-' + this.user.project + '-tasks' + fileExtension;
    link.click();
  }

  showDetails(task: Task) {
    const data = {
      uid: task.uid,
      author: task.author,
      project: task.project,
      title: task.title,
      description: task.description,
      assigned: task.assigned,
      state: task.state,
      order: task.order,
      history: task.history
    };
    this.dialog.open(TaskDetailViewComponent, { data, ...{} }).afterClosed().subscribe(
      async (updated) => {
        if (updated) {
          this.taskList = [...updated];
        }
      }
    );
  }
}
