import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslateService } from '@ngx-translate/core';
import { TaskState } from 'src/app/enums/task-state.enum';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
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

  constructor(
    private api: ApiService,
    private snackbar: SnackbarService,
    private translate: TranslateService,
    private user: UserService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
		setTimeout(() => this.inputTitle.nativeElement.focus());
	}

  private createForm(): void {
    this.createTaskForm = new FormGroup(
      {
        titleFormControl: new FormControl('', { validators: [Validators.required] }),
        descriptionFormControl: new FormControl('', { validators: [] }),
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

  get state(): string {
    return this.createTaskForm.get('stateFormControl')?.value;
  }

  public createTask() {
    const state = this.state === '' || this.state === null ? TaskState.NONE : this.state;
    this.api.createTask(this.user.token, this.user.username, this.user.permission, this.title, this.description, state).subscribe(
      (response) => {
        this.createTaskForm.reset();
        setTimeout(() => this.inputTitle.nativeElement.focus());
        this.snackbar.open(this.translate.instant(response.message));
      },
      (error) => {
        this.snackbar.open(this.translate.instant(error.error.message));
      }
    );
  }
}
