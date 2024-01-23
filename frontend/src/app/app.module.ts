import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';

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

import { UserService } from './services/user.service';

import { MaterialModule } from './modules/material.module';
import { SpinnerIconComponent } from './components/spinner-icon/spinner-icon.component';

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
    SpinnerIconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    DragDropModule,
    ColorPickerModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		})
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
