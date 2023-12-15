import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  
  constructor(
    private _translate: TranslateService
  ) {
    _translate.setDefaultLang('en');
    _translate.use(_translate.getBrowserLang() || 'en');
  }
}
