import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslateService } from '@ngx-translate/core';
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
  
  taskStates = [TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE];
  createTaskForm!: FormGroup;
  loading = false;
  members: User[] = [];

  constructor(
    private api: ApiService,
    private snackbar: SnackbarService,
    private translate: TranslateService,
    private user: UserService,
    private _error: ErrorService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.api.getTeamMembers(this.user.token).subscribe(
      (users) => {
        this.members = users;
      },
      (error) => {
        this._error.handleApiError(error);
      }
    );
		setTimeout(() => this.inputTitle.nativeElement.focus());
	}

  private createForm(): void {
    this.createTaskForm = new FormGroup(
      {
        titleFormControl: new FormControl('', { validators: [Validators.required] }),
        descriptionFormControl: new FormControl('', { validators: [] }),
        assignFormControl: new FormControl('', { validators: [] }),
        stateFormControl: new FormControl('', { validators: [] })
      },
      {}
    );
  }

  get title(): string {
		return this.createTaskForm.get('titleFormControl')?.value;
	}

	get description(): string {
		return this.createTaskForm.get('descriptionFormControl')?.value;
	}

  get assigned(): string {
    return this.createTaskForm.get('assignFormControl')?.value;
  }

  get state(): string {
    return this.createTaskForm.get('stateFormControl')?.value;
  }

  public isValid(): boolean {
    return this.createTaskForm.controls['titleFormControl']?.valid;
  }

  public createTask() {
    this.loading = true;
    const assigned = this.assigned === '' || this.assigned === null ? '' : this.assigned;
    const state = this.state === '' || this.state === null ? TaskState.NONE : this.state;
    this.api.createTask(this.user.token, this.title, this.description, assigned, state).subscribe(
      (response) => {
        this.loading = false;
        this.createTaskForm.reset();
        setTimeout(() => this.inputTitle.nativeElement.focus());
        this.snackbar.open(this.translate.instant(response.message));
      },
      (error) => {
        this.loading = false;
        this._error.handleApiError(error);
      }
    );
  }
}
