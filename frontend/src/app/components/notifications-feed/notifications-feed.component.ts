import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notifications-feed',
  templateUrl: './notifications-feed.component.html',
  styleUrls: ['./notifications-feed.component.scss']
})
export class NotificationsFeedComponent {
  
  constructor(
    private dialogRef: MatDialogRef<NotificationsFeedComponent>
  ) {

  }

  closeDialog(res: boolean): void {
		this.dialogRef.close(res);
	}
}
