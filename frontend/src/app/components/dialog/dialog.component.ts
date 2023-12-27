import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'src/app/interfaces/dialog-data';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  public headline = '';
	public description = '';
  public falseButton = '';
  public trueButton = '';

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

  }

  ngOnInit(): void {
    this.headline = this.data.headline;
    this.description = this.data.description;
    this.falseButton = this.data.falseButton;
    this.trueButton = this.data.trueButton;
  }

  closeDialog(res: boolean): void {
		this.dialogRef.close(res);
	}

}
