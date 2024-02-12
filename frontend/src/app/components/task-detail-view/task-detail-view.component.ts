import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Task } from 'src/app/interfaces/data/task';
import { User } from 'src/app/interfaces/data/user';
import { ApiService } from 'src/app/services/api/api.service';
import { ErrorService } from 'src/app/services/error.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-task-detail-view',
  templateUrl: './task-detail-view.component.html',
  styleUrls: ['./task-detail-view.component.scss']
})
export class TaskDetailViewComponent implements OnInit {
  loading: boolean = false;
  initialTask!: Task;
  task!: Task;
  members: User[] = [];

  constructor(
    private dialogRef: MatDialogRef<TaskDetailViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private api: ApiService,
    private user: UserService,
    private snackbar: SnackbarService,
    private storage: StorageService,
    private router: Router,
    private translate: TranslateService,
    private _error: ErrorService
  ) {
    
  }

  ngOnInit(): void {
    this.task = { ...this.data };
    this.initialTask = { ...this.data };
    this.api.getTeamMembers(this.user.token).subscribe(
      (users) => {
        this.members = users;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
  }

  disableSubmit(): boolean {
    return this.task.title === this.initialTask.title
      && this.task.description === this.initialTask.description
      && this.task.assigned === this.initialTask.assigned;
  }

  updateTaskDetails(): void {
    this.loading = true;
    this.api.updateTask(this.user.token, this.task).subscribe(
      (response) => {
        this.snackbar.open(this.translate.instant('SUCCESS.EDIT_TASK'));
        this.dialogRef.close(response);
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
    this.loading = false;
  }

  closeDialog(res: boolean): void {
		this.dialogRef.close(res);
	}

}
