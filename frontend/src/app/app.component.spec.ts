import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('AppComponent', () => {
  let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, TranslateModule.forRoot()],
			declarations: [AppComponent],
			providers: [
				{ provide: TranslateService, useClass: TranslateService }
			]
		});
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'frontend'`, () => {
    expect(component.title).toEqual('frontend');
  });
});
