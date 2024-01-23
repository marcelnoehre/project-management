import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Task } from 'src/app/interfaces/data/task';
import { ApiService } from 'src/app/services/api/api.service';
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

  constructor(
    private parser: ParserService,
    private api: ApiService,
    private user: UserService,
    private storage: StorageService,
    private router: Router,
    private translate: TranslateService,
    private snackbar: SnackbarService
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
    this.api.importTasks(this.user.token, this.user.username, this.user.project, this.taskList).subscribe(
      (response) => {
        console.log(response);
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
}
