import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from './services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  
  constructor(
    private _translate: TranslateService,
    private _event: EventService
  ) {
    _translate.setDefaultLang('en');
    _translate.use(_translate.getBrowserLang() || 'en');
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    this._event.documentClick$.next(event.target);
  }
}
