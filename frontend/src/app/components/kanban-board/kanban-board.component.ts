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
import * as JsonToXML from "js2xmlparser";
import * as YAML from 'yaml';

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
    private user: UserService
  ) {

  }

  async ngAfterViewInit(): Promise<void> {
    while (this.user.project === undefined) await new Promise<void>(done => setTimeout(() => done(), 5));
    this.api.getTaskList(this.user.token, this.user.project).subscribe(
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
    const foundState = this.taskList.find((list) => list.state === event.event.target.id);
    const previousIndex = foundState!.tasks[event.currentIndex - 1]?.order ? foundState!.tasks[event.currentIndex - 1].order : 0;
    const nextIndex = foundState!.tasks[event.currentIndex + 1]?.order === undefined ? previousIndex + 2 : foundState!.tasks[event.currentIndex + 1].order;
    this.api.updatePosition(this.user.token, this.user.project, foundState!.tasks[event.currentIndex].uid, foundState!.state, (previousIndex + nextIndex) / 2).subscribe(
      (tasklist) => {
        this.taskList = tasklist;
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

  getColor(state: string) {
    return TaskStateColor[state as keyof typeof TaskStateColor];
  }

  parseExport(list: State[]) {
    return list.map((item) => ({
      state: item.state,
      tasks: item.tasks.map(({ uid, project, state, ...task }) => task)
    }));
  }

  json() {
    this.export(new Blob([JSON.stringify(this.parseExport(this.taskList), null, 2)], { type: 'application/json' }), '.json');
  }

  xml() {
    this.export(new Blob([JsonToXML.parse('root', this.parseExport(this.taskList))], { type: 'application/xml' }), '.xml');
  }

  yaml() {
    this.export(new Blob([YAML.stringify(this.parseExport(this.taskList))], { type: 'text/yaml' }), '.yaml');
  }

  export(blob: Blob, fileExtension: string) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'export-' + this.user.project + '-tasks' + fileExtension;
    link.click();
  }
}
