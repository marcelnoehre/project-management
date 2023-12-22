import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBoardComponent } from './kanban-board.component';
import { environment } from 'src/environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from 'src/app/app.module';

describe('KanbanBoardComponent', () => {
  let component: KanbanBoardComponent;
  let fixture: ComponentFixture<KanbanBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), AppModule],
      declarations: [KanbanBoardComponent],
      providers: [{ provide: TranslateService, useClass: TranslateService }]
    });
    fixture = TestBed.createComponent(KanbanBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load test environment', () => {
		expect(environment.environement).toBe('test');
	});

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
