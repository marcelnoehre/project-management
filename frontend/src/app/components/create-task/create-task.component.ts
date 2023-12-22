import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskState } from 'src/app/enums/task-state.enum';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {
	@ViewChild('inputTitle') inputTitle!: ElementRef;
  
  taskStates = [TaskState.NO_STATUS, TaskState.TODO, TaskState.PROGRESS, TaskState.REVIEW, TaskState.DONE];
  createTaskForm!: FormGroup;

  constructor(
    private router: Router,
    private storage: StorageService
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

}
