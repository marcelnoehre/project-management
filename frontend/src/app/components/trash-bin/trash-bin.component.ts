import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Permission } from 'src/app/enums/permission.enum';
import { Task } from 'src/app/interfaces/data/task';
import { ApiService } from 'src/app/services/api/api.service';
import { ErrorService } from 'src/app/services/error.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-trash-bin',
  templateUrl: './trash-bin.component.html',
  styleUrls: ['./trash-bin.component.scss']
})
export class TrashBinComponent implements AfterViewInit {
  taskList: Task[] = [];
  loadingRestore: string = '';
  loadingDelete: string = '';
  loadingClear: boolean = false;

  constructor(
    private user: UserService,
    private api: ApiService,
    private storage: StorageService,
    private router: Router,
    private snackbar: SnackbarService,
    private translate: TranslateService,
    private _error: ErrorService
    ) {

  }

  async ngAfterViewInit(): Promise<void> {
    while (this.user.project === undefined) await new Promise<void>(done => setTimeout(() => done(), 5));
    this.api.getTrashBin(this.user.token).subscribe(
      (taskList) => {
        this.taskList = taskList;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }
  
  delete(uid: string, title: string) {
    this.loadingDelete = uid;
    this.api.deleteTask(this.user.token, uid).subscribe(
      (taskList) => {
        this.loadingDelete = '';
        this.taskList = taskList;
        this.snackbar.open(this.translate.instant('SUCCESS.TASK_DELETED', { title: title } ));
      },
      (error) => {
        this.loadingDelete = '';
        this._error.handleApiError(error);
      }
    );
  }

  restore(uid: string, title: string) {
    this.loadingRestore = uid;
    this.api.restoreTask(this.user.token, uid).subscribe(
      (taskList) => {
        this.loadingRestore = '';
        this.taskList = taskList;
        this.snackbar.open(this.translate.instant('SUCCESS.TASK_RESTORED', { title: title } ));
      },
      (error) => {
        this.loadingRestore = '';
        this._error.handleApiError(error);
      }
    );
  }

  clear() {
    this.loadingClear = true;
    this.api.clearTrashBin(this.user.token).subscribe(
      (response) => {
        this.loadingClear = false;
        this.taskList = [];
        this.snackbar.open(this.translate.instant(response.message));
      },
      (error) => {
        this.loadingClear = false;
        this._error.handleApiError(error);
      }
    );
  }

  disableDelete() {
    return !this.user.hasPermission(Permission.ADMIN);
  }

  showClear() {
    return this.user.hasPermission(Permission.ADMIN);
  }

  disableClear() {
    return this.taskList.length == 0;
  }

  restoreLoading(uid: string) {
    return uid === this.loadingRestore;
  }

  deleteLoading(uid: string) {
    return uid === this.loadingDelete;
  }
}
