import { AfterViewInit, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Permission } from 'src/app/enums/permission.enum';
import { Task } from 'src/app/interfaces/data/task';
import { ApiService } from 'src/app/services/api/api.service';
import { ErrorService } from 'src/app/services/error.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-trash-bin',
	templateUrl: './trash-bin.component.html',
	styleUrls: ['./trash-bin.component.scss']
})
export class TrashBinComponent implements AfterViewInit {
	private _loadingRestore = '';
	private _loadingDelete = '';
	public loadingClear = false;
	public taskList: Task[] = [];

	constructor(
		private _user: UserService,
		private _api: ApiService,
		private _snackbar: SnackbarService,
		private _translate: TranslateService,
		private _error: ErrorService
	) { }

	async ngAfterViewInit(): Promise<void> {
		while (this._user.project === undefined) await new Promise<void>(done => setTimeout(() => done(), 5));
		try  {
			this.taskList = await lastValueFrom(this._api.getTrashBin(this._user.token));
		} catch (error) {
			this._error.handleApiError(error);
		}
	}
  
	public async delete(uid: string, title: string): Promise<void> {
		try  {
			this._loadingDelete = uid;
			this.taskList = await lastValueFrom(this._api.deleteTask(this._user.token, uid));
			this._loadingDelete = '';
			this._snackbar.open(this._translate.instant('SUCCESS.TASK_DELETED', { title: title } ));
		} catch (error) {
			this._loadingDelete = '';
			this._error.handleApiError(error);
		}
	}
  
	public async restore(uid: string, title: string): Promise<void> {
		try  {
			this._loadingRestore = uid;
			this.taskList = await lastValueFrom(this._api.restoreTask(this._user.token, uid));
			this._loadingRestore = '';
			this._snackbar.open(this._translate.instant('SUCCESS.TASK_RESTORED', { title: title } ));
		} catch (error) {
			this._loadingRestore = '';
			this._error.handleApiError(error);
		}
	}

	public async clear(): Promise<void> {
		try  {
			this.loadingClear = true;
			const response = await lastValueFrom(this._api.clearTrashBin(this._user.token));
			this.loadingClear = false;
			this.taskList = [];
			this._snackbar.open(this._translate.instant(response.message));
		} catch (error) {
			this.loadingClear = false;
			this._error.handleApiError(error);
		}
	}

	public disableDelete(): boolean {
		return !this._user.hasPermission(Permission.ADMIN);
	}

	public showClear(): boolean {
		return this._user.hasPermission(Permission.ADMIN);
	}

	public disableClear(): boolean {
		return this.taskList.length == 0;
	}

	public restoreLoading(uid: string): boolean {
		return uid === this._loadingRestore;
	}

	public deleteLoading(uid: string): boolean {
		return uid === this._loadingDelete;
	}
}
