import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Progress } from 'src/app/interfaces/data/progress';
import { Task } from 'src/app/interfaces/data/task';
import { ApiService } from 'src/app/services/api/api.service';
import { ErrorService } from 'src/app/services/error.service';
import { ParserService } from 'src/app/services/parser.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-import-tasks',
  templateUrl: './import-tasks.component.html',
  styleUrls: ['./import-tasks.component.scss']
})
export class ImportTasksComponent {
  taskList: Task[] = [];
  fileInput: string = '';
  result!: Progress;
  loading: boolean = false;

  constructor(
    private parser: ParserService,
    private api: ApiService,
    private user: UserService,
    private translate: TranslateService,
    private snackbar: SnackbarService,
    private _error: ErrorService
  ) {

  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const fileExtension: string = file.name.split('.').pop()?.toLowerCase() || '';
      if(['json', 'xml', 'yaml', 'yml'].includes(fileExtension)) {
        const reader = new FileReader;
        reader.onload = (e) => {
          this.taskList = this.parser.encodeFileInput(e.target?.result as string, fileExtension);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  hasTaskList() {
    return this.taskList?.length > 0;
  }

  importTasks() {
    this.loading = true;
    this.api.importTasks(this.user.token, this.taskList).subscribe(
      (response) => {
        this.loading = false;
        this.result = response;
        this.taskList = response.taskList;
        this.snackbar.open(this.translate.instant('SUCCESS.IMPORT_TASKS'));
      },
      (error) => {
        this.loading = false;
        this._error.handleApiError(error);
      }
    );
  }
}
