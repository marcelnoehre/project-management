import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from './services/event.service';
import { DeviceService } from './services/device.service';
import { StorageService } from './services/storage.service';
import { environment } from 'src/environments/environment';

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
    private device: DeviceService,
    private storage: StorageService
  ) {
		const user = this.storage.getSessionEntry('user');
		_translate.setDefaultLang(environment.defaultLanguage);
		if (user?.language) {
      _translate.use(user.language);
		} else {
      _translate.use(_translate.getBrowserLang() || 'en');
		}
  }

  ngOnInit(): void {
    this.device.init();
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    this._event.documentClick$.next(event.target);
  }
}
