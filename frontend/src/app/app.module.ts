import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';
import { TimelineModule } from 'primeng/timeline';
import { NgApexchartsModule } from 'ng-apexcharts';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ToolbarProfileMenuComponent } from './components/toolbar/toolbar-profile-menu/toolbar-profile-menu.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { ProjectSettingsComponent } from './components/project-settings/project-settings.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import { ImportTasksComponent } from './components/import-tasks/import-tasks.component';
import { TrashBinComponent } from './components/trash-bin/trash-bin.component';
import { SpinnerIconComponent } from './components/spinner-icon/spinner-icon.component';
import { NotificationsFeedComponent } from './components/notifications-feed/notifications-feed.component';
import { TaskDetailViewComponent } from './components/task-detail-view/task-detail-view.component';
import { StatsComponent } from './components/stats/stats.component';

import { UserService } from './services/user.service';
import { NotificationsService } from './services/notifications.service';

import { MaterialModule } from './modules/material.module';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
	return new TranslateHttpLoader(http);
}

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegistrationComponent,
		CreateProjectComponent,
		SidenavComponent,
		ToolbarComponent,
		ToolbarProfileMenuComponent,
		DialogComponent,
		DashboardComponent,
		UserSettingsComponent,
		ProjectSettingsComponent,
		CreateTaskComponent,
		KanbanBoardComponent,
		ImportTasksComponent,
		TrashBinComponent,
		SpinnerIconComponent,
		NotificationsFeedComponent,
		TaskDetailViewComponent,
		StatsComponent
	],
	imports: [
		BrowserModule,
		NgChartsModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		HttpClientModule,
		DragDropModule,
		ColorPickerModule,
		TimelineModule,
		NgApexchartsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		})
	],
	providers: [UserService, NotificationsService],
	bootstrap: [AppComponent]
})
export class AppModule { }
