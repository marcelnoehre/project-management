import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Permission } from 'src/app/enums/permission.enum';
import { ApiService } from 'src/app/services/api/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

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
    private translate: TranslateService,
    private router: Router,
    private user: UserService
  ) {
    this.createForm();
  }

  closeDialog(res: boolean): void {
		this.dialogRef.close(res);
	}

	get project(): string {
		return this.projectForm.get('projectFormControl')?.value;
	}

  createProject() {
    this.api.createProject(this.user.token, this.user.username, this.project).subscribe(
      (response) => {
        this.snackbar.open(this.translate.instant(response.message));
        this.user.project = this.project;
        this.user.permission = Permission.OWNER;
        this.user.isLoggedIn = 'true';
        this.storage.setSessionEntry('user', this.user.user);
        this.dialogRef.close(true);
      },
      (error) => {
        if (error.status === 403) {
          this.storage.clearSession();
          this.router.navigateByUrl('/login');
        }
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
