import { Component } from '@angular/core';
import { AppColor } from 'src/app/enums/app-color.enum';
import { AppIcon } from 'src/app/enums/app-icon.enum';
import { AppItem } from 'src/app/enums/app-item.enum';
import { AppRoute } from 'src/app/enums/app-route.enum';
import { App } from 'src/app/interfaces/app';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
	public appItems: App[][] = [
		[{
			name: AppItem.Board,
			route: AppRoute.Board,
			icon: AppIcon.Board,
			color: AppColor.Board
		},
		{
			name: AppItem.Stats,
			route: AppRoute.Stats,
			icon: AppIcon.Stats,
			color: AppColor.Stats
		}],
		[{
			name: AppItem.CreateTask,
			route: AppRoute.CreateTask,
			icon: AppIcon.CreateTask,
			color: AppColor.CreateTask
		},
		{
			name: AppItem.ImportTasks,
			route: AppRoute.ImportTasks,
			icon: AppIcon.ImportTasks,
			color: AppColor.ImportTasks
		},
		{
			name: AppItem.TrashBin,
			route: AppRoute.TrashBin,
			icon: AppIcon.TrashBin,
			color: AppColor.TrashBin
		}],
		[{
			name: AppItem.ProjectSettings,
			route: AppRoute.ProjectSettings,
			icon: AppIcon.ProjectSettings,
			color: AppColor.ProjectSettings
		},
		{
			name: AppItem.UserSettings,
			route: AppRoute.UserSettings,
			icon: AppIcon.UserSettings,
			color: AppColor.UserSettings
		}]
	];
}
