import { Component } from '@angular/core';

@Component({
  selector: 'app-import-tasks',
  templateUrl: './import-tasks.component.html',
  styleUrls: ['./import-tasks.component.scss']
})
export class ImportTasksComponent {
  taskList: any

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if(['json', 'xml', 'yaml'].includes(fileExtension || '')) {
        const reader = new FileReader;
        reader.onload = (e) => {
            const result = e.target?.result as string;
            this.taskList = JSON.parse(atob(result.split(',')[1]));
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
