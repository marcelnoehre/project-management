import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from './services/event.service';
import { DeviceService } from './services/device.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  
  constructor(
    private _translate: TranslateService,
    private _event: EventService,
    private device: DeviceService
  ) {
    _translate.setDefaultLang('en');
    _translate.use(_translate.getBrowserLang() || 'en');
  }

  ngOnInit(): void {
    this.device.init();
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    this._event.documentClick$.next(event.target);
  }
}
