import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import { ProjectSettingsComponent } from './components/project-settings/project-settings.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { ImportTasksComponent } from './components/import-tasks/import-tasks.component';
import { TrashBinComponent } from './components/trash-bin/trash-bin.component';
import { StatsComponent } from './components/stats/stats.component';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'registration',
		component: RegistrationComponent,
	},
	{
		path: 'settings/user',
		component: UserSettingsComponent,
		canActivate: [authGuard]
	},
	{
		path: 'settings/project',
		component: ProjectSettingsComponent,
		canActivate: [authGuard]
	},
	{
		path: 'task/create',
		component: CreateTaskComponent,
		canActivate: [authGuard]
	},
	{
		path: 'tasks/board',
		component: KanbanBoardComponent,
		canActivate: [authGuard]
	},
	{
		path: 'tasks/import',
		component: ImportTasksComponent,
		canActivate: [authGuard]
	},
	{
		path: 'tasks/trash-bin',
		component: TrashBinComponent,
		canActivate: [authGuard]
	},
	{
		path: 'stats',
		component: StatsComponent,
		canActivate: [authGuard]
	},
	{
		path: '',
		component: DashboardComponent,
		canActivate: [authGuard]
	},
	{
		path: '**',
		redirectTo: ''
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
