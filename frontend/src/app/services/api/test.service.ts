import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Stats } from 'mocha';
import { Observable, of } from 'rxjs';
import { Permission } from 'src/app/enums/permission.enum';
import { AssignedStats } from 'src/app/interfaces/data/assigned-stats';
import { CategoryStats } from 'src/app/interfaces/data/category-stats';
import { Progress } from 'src/app/interfaces/data/progress';
import { ProjectRoadmap } from 'src/app/interfaces/data/project-roadmap';
import { Response } from 'src/app/interfaces/data/response';
import { StatLeaders } from 'src/app/interfaces/data/stat-leaders';
import { State } from 'src/app/interfaces/data/state';
import { Task } from 'src/app/interfaces/data/task';
import { TaskProgress } from 'src/app/interfaces/data/task-progress';
import { User } from 'src/app/interfaces/data/user';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
	private translate: TranslateService
  ) { }

	// ### AUTH ###
	public verify(token: string): Observable<User> {
		switch (token) {
			case 'owner':
				return of({
					token: 'owner',
					username: 'owner',
					fullName: 'Mock Owner',
					initials: 'MO',
					color: '#FFFFFF',
					language: 'en',
					project: 'MockProject',
					permission: Permission.OWNER,
					profilePicture: '',
					notificationsEnabled: true,
					isLoggedIn: true,
					stats: {
						created: 91,
						imported: 10,
						updated: 45,
						edited: 78,
						trashed: 32,
						restored: 57,
						deleted: 23,
						cleared: 69
					}
				});
			case 'admin':
				return of({
					token: 'admin',
					username: 'admin',
					fullName: 'Mock Admin',
					initials: 'MA',
					color: '#FFFFFF',
					language: 'en',
					project: 'MockProject',
					permission: Permission.ADMIN,
					profilePicture: '',
					notificationsEnabled: true,
					isLoggedIn: true,
					stats: {
						created: 42,
						imported: 15,
						updated: 78,
						edited: 63,
						trashed: 29,
						restored: 51,
						deleted: 94,
						cleared: 12
					}
				});
			case 'member':
				return of({
					token: 'member',
					username: 'member',
					fullName: 'Mock Member',
					initials: 'MM',
					color: '#FFFFFF',
					language: 'de',
					project: 'MockProject',
					permission: Permission.MEMBER,
					profilePicture: '',
					notificationsEnabled: true,
					isLoggedIn: true,
					stats: {
						created: 64,
						imported: 27,
						updated: 89,
						edited: 14,
						trashed: 50,
						restored: 73,
						deleted: 3,
						cleared: 67
					}
				});
			case 'invited':
				return of({
					token: 'invited',
					username: 'invited',
					fullName: 'Mock Invited',
					initials: 'MI',
					color: '#FFFFFF',
					language: 'en',
					project: 'MockProject',
					permission: Permission.INVITED,
					profilePicture: '',
					notificationsEnabled: true,
					isLoggedIn: true,
					stats: {
						created: 77,
						imported: 42,
						updated: 19,
						edited: 56,
						trashed: 83,
						restored: 5,
						deleted: 38,
						cleared: 91
					}
				});
			case 'none':
				return of({
					token: 'none',
					username: 'none',
					fullName: 'Mock None',
					initials: 'MN',
					color: '#FFFFFF',
					language: 'en',
					project: 'MockProject',
					permission: Permission.NONE,
					profilePicture: '',
					notificationsEnabled: true,
					isLoggedIn: true,
					stats: {
						created: 0,
						imported: 0,
						updated: 0,
						edited: 0,
						trashed: 0,
						restored: 0,
						deleted: 0,
						cleared: 0
					}
				});
			default:
				throw new Error(this.translate.instant('ERROR.INVALID_TOKEN'));
		}
	}

	public refreshToken(token: string): Observable<string> {
		if (['owner', 'admin', 'member', 'invited', 'none'].includes(token)) {
			return of(token);
		} else {
			throw new Error(this.translate.instant('ERROR.INVALID_TOKEN'));
		}
	}

	public login(username: string, password: string): Observable<User> {
		switch (username) {
			case 'owner':
				return of({
					token: 'owner',
					username: 'owner',
					fullName: 'Mock Owner',
					initials: 'MO',
					color: '#FFFFFF',
					language: 'en',
					project: 'MockProject',
					permission: Permission.OWNER,
					profilePicture: '',
					notificationsEnabled: true,
					isLoggedIn: true,
					stats: {
						created: 91,
						imported: 10,
						updated: 45,
						edited: 78,
						trashed: 32,
						restored: 57,
						deleted: 23,
						cleared: 69
					}
				});
			case 'admin':
				return of({
					token: 'admin',
					username: 'admin',
					fullName: 'Mock Admin',
					initials: 'MA',
					color: '#FFFFFF',
					language: 'en',
					project: 'MockProject',
					permission: Permission.ADMIN,
					profilePicture: '',
					notificationsEnabled: true,
					isLoggedIn: true,
					stats: {
						created: 42,
						imported: 15,
						updated: 78,
						edited: 63,
						trashed: 29,
						restored: 51,
						deleted: 94,
						cleared: 12
					}
				});
			case 'member':
				return of({
					token: 'member',
					username: 'member',
					fullName: 'Mock Member',
					initials: 'MM',
					color: '#FFFFFF',
					language: 'de',
					project: 'MockProject',
					permission: Permission.MEMBER,
					profilePicture: '',
					notificationsEnabled: true,
					isLoggedIn: true,
					stats: {
						created: 64,
						imported: 27,
						updated: 89,
						edited: 14,
						trashed: 50,
						restored: 73,
						deleted: 3,
						cleared: 67
					}
				});
			case 'invited':
				return of({
					token: 'invited',
					username: 'invited',
					fullName: 'Mock Invited',
					initials: 'MI',
					color: '#FFFFFF',
					language: 'en',
					project: 'MockProject',
					permission: Permission.INVITED,
					profilePicture: '',
					notificationsEnabled: true,
					isLoggedIn: true,
					stats: {
						created: 77,
						imported: 42,
						updated: 19,
						edited: 56,
						trashed: 83,
						restored: 5,
						deleted: 38,
						cleared: 91
					}
				});
			case 'none':
				return of({
					token: 'none',
					username: 'none',
					fullName: 'Mock None',
					initials: 'MN',
					color: '#FFFFFF',
					language: 'en',
					project: 'MockProject',
					permission: Permission.NONE,
					profilePicture: '',
					notificationsEnabled: true,
					isLoggedIn: true,
					stats: {
						created: 0,
						imported: 0,
						updated: 0,
						edited: 0,
						trashed: 0,
						restored: 0,
						deleted: 0,
						cleared: 0
					}
				});
			default:
				throw new Error(this.translate.instant('ERROR.INVALID_TOKEN'));
		}
	}

	public register(username: string, fullName: string, language: string, password: string): Observable<Response> {
		if (username === '') {
			return of({
				message: 'SUCCESS.REGISTRATION'
			});
		} else {
			throw new Error('ERROR.REGISTRATION');
		}
	}

	public updateUser(token: string, attribute: string, value: string): Observable<Response> {
		return of({
			message: 'SUCCESS.UPDATE_ACCOUNT'
		});
	}

	public toggleNotifications(token: string, notificationsEnabled: boolean): Observable<Response> {
		if (notificationsEnabled) {
			return of({
				message: 'SUCCESS.NOTIFICATIONS_ON'
			});
		} else {
			return of({
				message: 'SUCCESS.NOTIFICATIONS_OFF'
			});
		}
	}

	public deleteUser(token: string): Observable<Response> {
    	return of({
			message: 'SUCCESS.DELETE_ACCOUNT'
		});
	}


	// ### NOTIFICATIONS ###
	public getNotifications(token: string): Observable<Notification[]> {
    throw Error('Method not implemented!');
	}

	public updateNotifications(token: string, seen: string[], removed: string[]): Observable<Notification[]> {
    throw Error('Method not implemented!');
	}


	// ### PROJECT ###
	public getTeamMembers(token: string): Observable<User[]> {
    throw Error('Method not implemented!');
	}

	public createProject(token: string, project: string): Observable<Response> {
    throw Error('Method not implemented!');
	}

	public inviteUser(token: string, username: string): Observable<User> {
    throw Error('Method not implemented!');
	}

	public handleInvite(token: string, decision: boolean): Observable<Response> {
    throw Error('Method not implemented!');
	}

	public updatePermission(token: string, username: string, permission: Permission): Observable<User[]> {
    throw Error('Method not implemented!');
	}

	public removeUser(token: string, username: string): Observable<Response> {
    throw Error('Method not implemented!');
	}

	public leaveProject(token: string): Observable<Response> {
    throw Error('Method not implemented!');
	}


  	// ### STATS ###
	public personalStats(token: string): Observable<Stats> {
    throw Error('Method not implemented!');
	}

	public stats(token: string): Observable<AssignedStats[]> {
    throw Error('Method not implemented!');
	}

	public statLeaders(token: string): Observable<StatLeaders> {
    throw Error('Method not implemented!');
	}

	public taskAmount(token: string): Observable<CategoryStats> {
    throw Error('Method not implemented!');
	}

	public averageTime(token: string): Observable<CategoryStats> {
    throw Error('Method not implemented!');
	}

	public wip(token: string): Observable<number> {
    throw Error('Method not implemented!');
	}

	public taskProgress(token: string): Observable<TaskProgress> {
    throw Error('Method not implemented!');
	}

	public projectRoadmap(token: string): Observable<ProjectRoadmap[]> {
    throw Error('Method not implemented!');
	}

	public optimizeOrder(token: string): Observable<Response> {
    throw Error('Method not implemented!');
	}


	// ### TASKS ###
	public createTask(token: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
    throw Error('Method not implemented!');
	}

	public importTasks(token: string, tasks: Task[]): Observable<Progress> {
    throw Error('Method not implemented!');
	}

	public getTaskList(token: string): Observable<State[]> {
    throw Error('Method not implemented!');
	}

	public updateTask(token: string, task: Task): Observable<State[]> {
    throw Error('Method not implemented!');
	}

	public updatePosition(token: string, uid: string, state: string, order: number): Observable<State[]> {
    throw Error('Method not implemented!');
	}

	public moveToTrashBin(token: string, uid: string): Observable<State[]> {
    throw Error('Method not implemented!');
	}
	
	public getTrashBin(token: string): Observable<Task[]> {
    throw Error('Method not implemented!');
	}

	public deleteTask(token: string, uid: string): Observable<Task[]> {
    throw Error('Method not implemented!');
	}

	public restoreTask(token: string, uid: string): Observable<Task[]> {
    throw Error('Method not implemented!');
	}

	public clearTrashBin(token: string): Observable<Response> {
    throw Error('Method not implemented!');
	}
}
