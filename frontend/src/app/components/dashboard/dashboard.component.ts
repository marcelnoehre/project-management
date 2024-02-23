import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

	constructor(
		private _router: Router
	) { }

	public appItems: App[][] = [
		[{
			name: AppItem.BOARD,
			route: AppRoute.BOARD,
			icon: AppIcon.BOARD,
			color: AppColor.BOARD
		},
		{
			name: AppItem.STATS,
			route: AppRoute.STATS,
			icon: AppIcon.STATS,
			color: AppColor.STATS
		}],
		[{
			name: AppItem.CREATE_TASK,
			route: AppRoute.CREATE_TASK,
			icon: AppIcon.CREATE_TASK,
			color: AppColor.CREATE_TASK
		},
		{
			name: AppItem.IMPORT_TASKS,
			route: AppRoute.IMPORT_TASKS,
			icon: AppIcon.IMPORT_TASKS,
			color: AppColor.IMPORT_TASKS
		},
		{
			name: AppItem.TRASH_BIN,
			route: AppRoute.TRASH_BIN,
			icon: AppIcon.TRASH_BIN,
			color: AppColor.TRASH_BIN
		}],
		[{
			name: AppItem.PROJECT_SETTINGS,
			route: AppRoute.PROJECT_SETTINGS,
			icon: AppIcon.PROJECT_SETTINGS,
			color: AppColor.PROJECT_SETTINGS
		},
		{
			name: AppItem.USER_SETTINGS,
			route: AppRoute.USER_SETTINGS,
			icon: AppIcon.USER_SETTINGS,
			color: AppColor.USER_SETTINGS
		}]
	];

	public redirectTo(route: string): void {
		this._router.navigateByUrl(route);
	}
}
