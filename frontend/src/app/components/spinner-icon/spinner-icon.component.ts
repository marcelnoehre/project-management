import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-spinner-icon',
	templateUrl: './spinner-icon.component.html',
	styleUrls: ['./spinner-icon.component.scss']
})
export class SpinnerIconComponent {
	@Input() icon = '';
	@Input() spinning = false;
}
