import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Permission } from 'src/app/enums/permission.enum';
import { User } from 'src/app/interfaces/data/user';
import { ApiService } from 'src/app/services/api/api.service';
import { ErrorService } from 'src/app/services/error.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
  public projectForm!: FormGroup;
  public loading = false;

  constructor(
    private _dialogRef: MatDialogRef<CreateProjectComponent>,
    private _api: ApiService,
    private _storage: StorageService,
    private _snackbar: SnackbarService,
    private _translate: TranslateService,
    private _user: UserService,
    private _error: ErrorService
  ) {
    this._createForm();
  }

  private _createForm(): void {
    this.projectForm = new FormGroup({
      projectFormControl: new FormControl('', {validators: [Validators.required] })
    });
  }

	private get _project(): string {
		return this.projectForm.get('projectFormControl')?.value;
	}

  private get _sessionUser(): User {
    return this._storage.getSessionEntry('user');
  }

  public closeDialog(res: boolean): void {
		this._dialogRef.close(res);
	}

  public async createProject(): Promise<void> {
    try {
      const response = await lastValueFrom(this._api.createProject(this._sessionUser.token, this._project));
      const token = await lastValueFrom(this._api.refreshToken(this._sessionUser.token));
      this._user.user = this._sessionUser;
      this._user.token = token;
      this._user.project = this._project;
      this._user.permission = Permission.OWNER;
      this._user.isLoggedIn = true;
      this._storage.setSessionEntry('user', this._user.user);
      this.loading = false;
      this._snackbar.open(this._translate.instant(response.message));
      this._dialogRef.close(true);
    } catch (error) {
      this.loading = false;
      this._error.handleApiError(error);
    }
  }

  public projectValid(): boolean {
		return this.projectForm.controls['projectFormControl'].valid;
	}
}
