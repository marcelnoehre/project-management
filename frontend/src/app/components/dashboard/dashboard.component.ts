import { Component } from '@angular/core';
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
			name: AppItem.CreateTask,
			route: AppRoute.CreateTask,
			icon: AppIcon.CreateTask,
			color: 'cadetblue'
		},
		{
			name: AppItem.Board,
			route: AppRoute.Board,
			icon: AppIcon.Board,
			color: 'mediumslateblue'
		}],
		[{
			name: AppItem.TrashBin,
			route: AppRoute.TrashBin,
			icon: AppIcon.TrashBin,
			color: 'salmon'
		},
		{
			name: AppItem.ImportTasks,
			route: AppRoute.ImportTasks,
			icon: AppIcon.ImportTasks,
			color: 'goldenrod'
		}]
	];
}
