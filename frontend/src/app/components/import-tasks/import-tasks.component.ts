import { Component } from '@angular/core';
import { Task } from 'src/app/interfaces/data/task';
import { ParserService } from 'src/app/services/parser.service';

@Component({
  selector: 'app-import-tasks',
  templateUrl: './import-tasks.component.html',
  styleUrls: ['./import-tasks.component.scss']
})
export class ImportTasksComponent {
  taskList: Task[] = [];
  fileInput: string = '';

  constructor(private parser: ParserService) {

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
}
