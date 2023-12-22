import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaskComponent } from './create-task.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('CreateTaskComponent', () => {
  let component: CreateTaskComponent;
  let fixture: ComponentFixture<CreateTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, TranslateModule.forRoot()],
      declarations: [CreateTaskComponent],
      providers: [{ provide: TranslateService, useClass: TranslateService }]
    });
    fixture = TestBed.createComponent(CreateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
