import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Progress } from 'src/app/interfaces/data/progress';
import { Task } from 'src/app/interfaces/data/task';
import { ApiService } from 'src/app/services/api/api.service';
import { ErrorService } from 'src/app/services/error.service';
import { ParserService } from 'src/app/services/parser.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-import-tasks',
  templateUrl: './import-tasks.component.html',
  styleUrls: ['./import-tasks.component.scss']
})
export class ImportTasksComponent {
  public taskList: Task[] = [];
  public result!: Progress | null;
  public loading = false;

  constructor(
    private _parser: ParserService,
    private _api: ApiService,
    private _user: UserService,
    private _translate: TranslateService,
    private _snackbar: SnackbarService,
    private _error: ErrorService
  ) { }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const fileExtension: string = file.name.split('.').pop()?.toLowerCase() || '';
      if(['json', 'xml', 'yaml', 'yml'].includes(fileExtension)) {
        const reader = new FileReader;
        reader.onload = (e) => {
          this.taskList = this._parser.encodeFileInput(e.target?.result as string, fileExtension);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  public hasTaskList(): boolean {
    return this.taskList?.length > 0;
  }

  public async importTasks(): Promise<void> {
    this.loading = true;
    try {
      this.result = await lastValueFrom(this._api.importTasks(this._user.token, this.taskList));
      this.taskList = this.result.taskList;
      this.loading = false;
      this._snackbar.open(this._translate.instant('SUCCESS.IMPORT_TASKS'));
    } catch (error) {
      this.loading = false;
      this._error.handleApiError(error);
    }
  }

  public reset(): void {
    this.taskList = [];
    this.result = null;
  }
}
