import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-request-button',
  templateUrl: './request-button.component.html',
  styleUrls: ['./request-button.component.scss']
})
export class RequestButtonComponent {
  @Input() icon: string = '';
  @Input() color: string = '';
  @Input() disabled: boolean = false;
  @Input() spinning: boolean = false;
  @Input() matFab: boolean = false;
  @Output() click = new EventEmitter();

  public onClick() {
		this.click.emit();
	}
}
