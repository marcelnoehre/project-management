import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Task } from 'src/app/interfaces/data/task';
import { User } from 'src/app/interfaces/data/user';
import { ApiService } from 'src/app/services/api/api.service';
import { ErrorService } from 'src/app/services/error.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-task-detail-view',
	templateUrl: './task-detail-view.component.html',
	styleUrls: ['./task-detail-view.component.scss']
})
export class TaskDetailViewComponent implements OnInit {
	private _initialTask!: Task;
	public task!: Task;
	public members: User[] = [];
	public loading = false;

	constructor(
		private _dialogRef: MatDialogRef<TaskDetailViewComponent>,
		@Inject(MAT_DIALOG_DATA) private _data: Task,
		private _api: ApiService,
		private _user: UserService,
		private _snackbar: SnackbarService,
		private _translate: TranslateService,
		private _error: ErrorService
	) { }

	async ngOnInit(): Promise<void> {
		this.task = { ...this._data };
		this._initialTask = { ...this._data };
		try {
			this.members = await lastValueFrom(this._api.getTeamMembers(this._user.token));
		} catch (error) {
			this._error.handleApiError(error);
		}
	}

	public async updateTaskDetails(): Promise<void> {
		try {
			this.loading = true;
			const response = await lastValueFrom(this._api.updateTask(this._user.token, this.task));
			this.loading = false;
			this._snackbar.open(this._translate.instant('SUCCESS.EDIT_TASK'));
			this._dialogRef.close(response);
		} catch (error) {
			this.loading = false;
			this._error.handleApiError(error);
		}
	}

	public closeDialog(res: boolean): void {
		this._dialogRef.close(res);
	}

	public disableSubmit(): boolean {
		return this.task.title === this._initialTask.title
      && this.task.description === this._initialTask.description
      && this.task.assigned === this._initialTask.assigned;
	}
}
