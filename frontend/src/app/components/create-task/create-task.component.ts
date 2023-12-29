import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslateService } from '@ngx-translate/core';
import { TaskState } from 'src/app/enums/task-state.enum';
import { ApiService } from 'src/app/services/api/api.service';
import { PermissionService } from 'src/app/services/permission.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';

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
    private storage: StorageService,
    private api: ApiService,
    private permission: PermissionService,
    private snackbar: SnackbarService,
    private translate: TranslateService
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

  get user(): Record<string, unknown> {
		return this.storage.getSessionEntry('user');
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

  private getUser(): any {
		return this.storage.getSessionEntry('user');
	}

  public createTask() {
    const user = this.getUser();
    const state = this.state === '' || this.state === null ? TaskState.NONE : this.state;
    this.api.createTask(user.token, user.username, this.permission.getProject(), this.title, this.description, state).subscribe(
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
