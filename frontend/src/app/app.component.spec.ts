import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';
import { AppModule } from './app.module';
import { environment } from 'src/environments/environment';

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, AppModule],
			declarations: [AppComponent],
			providers: [
				{ provide: TranslateService, useClass: TranslateService },
			]
		});
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should load test environment', () => {
		expect(environment.selectedApi).toBe('test');
	});

	it('should create the app', () => {
		expect(component).toBeTruthy();
	});

	it('should have as title: frontend', () => {
		expect(component.title).toEqual('frontend');
	});
});
