import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { TaskState } from 'src/app/enums/task-state.enum';
import { User } from 'src/app/interfaces/data/user';
import { ApiService } from 'src/app/services/api/api.service';
import { ErrorService } from 'src/app/services/error.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-create-task',
	templateUrl: './create-task.component.html',
	styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {
	@ViewChild('inputTitle') inputTitle!: ElementRef;
	@ViewChild('submitCreateTask') submitCreateTask!: MatButton;
  
	public createTaskForm!: FormGroup;
	public taskStates = [TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE];
	public members: User[] = [];
	public loading = false;

	constructor(
		private _api: ApiService,
		private _snackbar: SnackbarService,
		private _translate: TranslateService,
		private _user: UserService,
		private _error: ErrorService
	) {
		this._createForm();
	}

	async ngOnInit(): Promise<void> {
		try {
			this.members = await lastValueFrom(this._api.getTeamMembers(this._user.token));
		} catch (error) {
			this._error.handleApiError(error);
		}
		setTimeout(() => this.inputTitle.nativeElement.focus());
	}

	private _createForm(): void {
		this.createTaskForm = new FormGroup(
			{
				titleFormControl: new FormControl('', { validators: [Validators.required, Validators.maxLength(32)] }),
				descriptionFormControl: new FormControl('', { validators: [] }),
				assignFormControl: new FormControl('', { validators: [] }),
				stateFormControl: new FormControl('', { validators: [] })
			}, { }
		);
	}

	private get _title(): string {
		return this.createTaskForm.get('titleFormControl')?.value;
	}

	private get _description(): string {
		return this.createTaskForm.get('descriptionFormControl')?.value;
	}

	private get _assigned(): string {
		return this.createTaskForm.get('assignFormControl')?.value;
	}

	private get _state(): string {
		return this.createTaskForm.get('stateFormControl')?.value;
	}

	public async createTask(): Promise<void> {
		this.loading = true;
		const assigned = this._assigned === '' || this._assigned === null ? '' : this._assigned;
		const state = this._state === '' || this._state === null ? TaskState.NONE : this._state;
		try {
			const response = await lastValueFrom(this._api.createTask(this._user.token, this._title, this._description, assigned, state));
			this.loading = false;
			this.createTaskForm.reset();
			setTimeout(() => this.inputTitle.nativeElement.focus());
			this._snackbar.open(this._translate.instant(response.message));
		} catch (error) {
			this.loading = false;
			this._error.handleApiError(error);
		}
	}

	public isValid(): boolean {
		return this.createTaskForm.controls['titleFormControl']?.valid;
	}
}
