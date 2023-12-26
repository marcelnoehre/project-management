import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Permission } from 'src/app/enums/permission.enum';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
  projectForm!: FormGroup;
  created: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CreateProjectComponent>,
    private api: ApiService,
    private storage: StorageService,
    private snackbar: SnackbarService,
    private translate: TranslateService
  ) {
    this.createForm();
  }

  closeDialog(res: boolean): void {
		this.dialogRef.close(res);
	}

	get project(): string {
		return this.projectForm.get('projectFormControl')?.value;
	}

	private getUser(): any {
		return this.storage.getSessionEntry('user');
	}

  createProject() {
    this.api.createProject(this.getUser().username, this.project).subscribe(
      (response) => {
        this.snackbar.open(this.translate.instant(response.message));
        let user = this.getUser();
        user.project = this.project;
        user.permission = Permission.ADMIN;
        user.isLoggedIn = true;
        this.storage.setSessionEntry('user', user);
        this.dialogRef.close(true);
      },
      (error) => {
        this.snackbar.open(this.translate.instant(error.error.message));
      }
    );
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
