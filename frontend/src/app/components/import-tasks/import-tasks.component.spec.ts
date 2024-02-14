import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTasksComponent } from './import-tasks.component';
import { AppModule } from 'src/app/app.module';

describe('ImportTasksComponent', () => {
  let component: ImportTasksComponent;
  let fixture: ComponentFixture<ImportTasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ImportTasksComponent]
    });
    fixture = TestBed.createComponent(ImportTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
