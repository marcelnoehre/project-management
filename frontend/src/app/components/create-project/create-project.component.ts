import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnDestroy {
  projectForm!: FormGroup;
  created: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CreateProjectComponent>
  ) {
    this.createForm();
  }

  ngOnDestroy(): void {
    if (!this.created) this.dialogRef.close(false);
  }

  closeDialog(res: boolean): void {
		this.dialogRef.close(res);
	}

  createProject() {
    this.dialogRef.close(true);
  }

  createForm() {
    this.projectForm = new FormGroup({
      projectFormControl: new FormControl('', {validators: [Validators.required] })
    });
  }

  public projectValid(): boolean {
		return this.projectForm.controls['projectFormControl'].valid;
	}
}
