import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {

  constructor(
    private dialogRef: MatDialogRef<CreateProjectComponent>
  ) {

  }

  closeDialog(res: boolean): void {		
		this.dialogRef.close(res);
	}
}
