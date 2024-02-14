import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashBinComponent } from './trash-bin.component';
import { AppModule } from 'src/app/app.module';
import { TranslateService } from '@ngx-translate/core';

describe('TrashBinComponent', () => {
  let component: TrashBinComponent;
  let fixture: ComponentFixture<TrashBinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [TrashBinComponent],
      providers: [
        { provide: TranslateService, useClass: TranslateService }
      ]
    });
    fixture = TestBed.createComponent(TrashBinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
