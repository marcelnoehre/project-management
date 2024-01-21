import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Task } from 'src/app/interfaces/data/task';
import { ApiService } from 'src/app/services/api/api.service';
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

  constructor(
    private user: UserService,
    private api: ApiService,
    private storage: StorageService,
    private router: Router,
    private snackbar: SnackbarService,
    private translate: TranslateService
    ) {

  }

  async ngAfterViewInit(): Promise<void> {
    while (this.user.project === undefined) await new Promise<void>(done => setTimeout(() => done(), 5));
    this.api.getTrashBin(this.user.token, this.user.project).subscribe(
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
  
  delete(uid: string) {
  }

  restore(uid: string) {
    this.api.restoreTask(this.user.token, this.user.project, uid).subscribe(
      (taskList) => {
        this.taskList = taskList;
        this.snackbar.open(this.translate.instant('SUCCESS.TASK_RESTORED', { uid: uid } ));
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

  clear() {
    this.api.clearTrashBin(this.user.token, this.user.project).subscribe(
      (response) => {
        this.taskList = [];
        this.snackbar.open(this.translate.instant(response.message));
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

  disableClear() {
    return this.taskList.length == 0;
  }
}
