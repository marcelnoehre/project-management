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
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements AfterViewInit {
  private _targets = [TaskState.NONE, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE, TaskState.DELETED];
  public stateList: string[] = [TaskState.NONE, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE, TaskState.DELETED];
  public taskList: State[] = [];
  public loadingDelete: boolean = false;

  constructor(
    private _api: ApiService,
    private _snackbar: SnackbarService,
    private _translate: TranslateService,
    private _user: UserService,
    private _parser: ParserService,
    private _dialog: MatDialog,
    private _error: ErrorService
  ) {

  }

  async ngAfterViewInit(): Promise<void> {
    while (this._user.project === undefined) await new Promise<void>(done => setTimeout(() => done(), 5));
    try {
      this.taskList = await lastValueFrom(this._api.getTaskList(this._user.token));
    } catch (error) {
      this._error.handleApiError(error);
    }
  }

  private _export(blob: Blob, fileExtension: string): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'export-' + this._user.project + '-tasks' + fileExtension;
    link.click();
  }

  public async drop(event: any): Promise<void> {
    try {
      if (!this._targets.includes(event.event.target.id)) {
        return;
      }
      if (event.event.target.id === TaskState.DELETED) {
        this.loadingDelete = true;
        try {
          this.taskList = await lastValueFrom(this._api.moveToTrashBin(this._user.token, event.previousContainer.data[event.previousIndex].uid));
          this.loadingDelete = false;
          this._snackbar.open(this._translate.instant('SUCCESS.MOVE_TO_TRASH'));
        } catch (error) {
          this.loadingDelete = false;
          this._error.handleApiError(error);
        }
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
      const previousIndex = foundState?.tasks[event.currentIndex - 1]?.order ? foundState?.tasks[event.currentIndex - 1].order : 0;
      const nextIndex = foundState?.tasks[event.currentIndex + 1]?.order === undefined ? previousIndex + 2 : foundState?.tasks[event.currentIndex + 1].order;
      try {
        this.taskList = await lastValueFrom(this._api.updatePosition(this._user.token, foundState!.tasks[event.currentIndex].uid, foundState!.state, (previousIndex + nextIndex) / 2));
      } catch (error) {
        this._error.handleApiError(error);
      }
    } catch (err) {
      this._snackbar.open(this._translate.instant('ERROR.NO_VALID_SECTION'));
    }
  }

  public json(): void {
    this._export(this._parser.statesToJSON(this.taskList), '.json');
  }

  public xml(): void {
    this._export(this._parser.statesToXML(this.taskList), '.xml');
  }

  public yaml(): void {
    this._export(this._parser.statesToYAML(this.taskList), '.yaml');
  }

  public getColor(state: string): TaskStateColor {
    return TaskStateColor[state as keyof typeof TaskStateColor];
  }

  public showDetails(task: Task): void {
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
    this._dialog.open(TaskDetailViewComponent, { data, ...{} }).afterClosed().subscribe(
      async (updated) => {
        if (updated) {
          this.taskList = [...updated];
        }
      }
    );
  }
}
