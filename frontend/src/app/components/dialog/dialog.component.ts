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
		private _dialogRef: MatDialogRef<DialogComponent>,
		@Inject(MAT_DIALOG_DATA) private _data: DialogData
	) { }

	ngOnInit(): void {
		this.headline = this._data.headline;
		this.description = this._data.description;
		this.falseButton = this._data.falseButton;
		this.trueButton = this._data.trueButton;
	}

	closeDialog(res: boolean): void {
		this._dialogRef.close(res);
	}
}
