import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Stats } from 'mocha';
import { Observable, of } from 'rxjs';
import { Permission } from 'src/app/enums/permission.enum';
import { TaskState } from 'src/app/enums/task-state.enum';
import { AssignedStats } from 'src/app/interfaces/data/assigned-stats';
import { CategoryStats } from 'src/app/interfaces/data/category-stats';
import { Notification } from 'src/app/interfaces/data/notification';
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
		return this.user(token);
	}

	public refreshToken(token: string): Observable<string> {
		if (['owner', 'admin', 'member', 'invited', 'none'].includes(token)) {
			return of(token);
		} else {
			throw new Error(this.translate.instant('ERROR.INVALID_TOKEN'));
		}
	}

	public login(username: string, password: string): Observable<User> {
		return this.user(username);
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
		return of([
			{
				uid: 'lPMZOH0Hxy6z0mhZ9shV', 
				message: 'NOTIFICATIONS.NEW.JOINED', 
				data: ['admin'], 
				icon: 'person_add', 
				timestamp: 1707948598239, 
				seen: false 
			},
			{ 
				uid: 'lk8id9WVL0N1o97vRDK6', 
				message: 'NOTIFICATIONS.NEW.CREATE_TASK', 
				data: ['admin', 'mock'], 
				icon: 'note_add', 
				timestamp: 1707948640062, 
				seen: true 
			}
		]);
	}

	public updateNotifications(token: string, seen: string[], removed: string[]): Observable<Notification[]> {
		return of([
			{
				uid: 'lPMZOH0Hxy6z0mhZ9shV', 
				message: 'NOTIFICATIONS.NEW.JOINED', 
				data: ['admin'], 
				icon: 'person_add', 
				timestamp: 1707948598239, 
				seen: false 
			},
			{ 
				uid: 'lk8id9WVL0N1o97vRDK6', 
				message: 'NOTIFICATIONS.NEW.CREATE_TASK', 
				data: ['admin', 'mock'], 
				icon: 'note_add', 
				timestamp: 1707948640062, 
				seen: true 
			}
		]);
	}


	// ### PROJECT ###
	public getTeamMembers(token: string): Observable<User[]> {
		return of(this.member());	
	}

	public createProject(token: string, project: string): Observable<Response> {
		return of({
			message: 'SUCCESS.CREATE_PROJECT'
		});
	}

	public inviteUser(token: string, username: string): Observable<User> {
		if (username === 'inviteAnother') {
			return of({
				token: 'invitedAnother',
				username: 'invitedAnother',
				fullName: 'Mock InvitedAnother',
				initials: 'MI',
				color: '#FFFFFF',
				language: 'en',
				project: 'MockProject',
				permission: Permission.INVITED,
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
		} else {
			throw Error('ERROR.NO_ACCOUNT');
		}
	}

	public handleInvite(token: string, decision: boolean): Observable<Response> {
		if (decision) {
			return of({
				message: 'SUCCESS.INVITE_ACCEPTED'
			});
		} else {
			return of({
				message: 'SUCCESS.INVITE_REJECTED'
			});
		}
	}

	public updatePermission(token: string, username: string, permission: Permission): Observable<User[]> {
		return of([
			{
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
			},    
			{
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
			},
			{
				token: 'member',
				username: 'member',
				fullName: 'Mock Member',
				initials: 'MM',
				color: '#FFFFFF',
				language: 'de',
				project: 'mockProject',
				permission: Permission.MEMBER,
				profilePicture: '',
				notificationsEnabled: false,
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
			},
			{
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
			}
		]);
	}

	public removeUser(token: string, username: string): Observable<Response> {
		return of({
			message: 'SUCCESS.REMOVE_MEMBER'
		});
	}

	public leaveProject(token: string): Observable<Response> {
		return of({
			message: 'SUCCESS.LEAVE_PROJECT'
		});
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


	// ### TASK ###
	public createTask(token: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
		return of({
			message: 'SUCCESS.CREATE_TASK'
		});
	}

	public importTasks(token: string, tasks: Task[]): Observable<Progress> {
		return of({
			amount: 11,
			success: 11,
			fail: 0,
			taskList: [
			  {
				title: 'Documentation',
				description: 'Prepare comprehensive documentation for the project, including user manuals and technical guides.',
				state: TaskState.NONE,
				author: 'mock'
			  },
			  {
				title: 'Finalize Project',
				description: 'Review all aspects of the project and prepare for the final release.',
				state: TaskState.NONE,
				author: 'mock'
			  },
			  {
				title: 'Complete Project Proposal',
				description: 'Draft a detailed project proposal outlining goals, scope, and deliverables.',
				state: TaskState.TODO,
				author: 'mock'
			  },
			  {
				title: 'Revise User Interface',
				description: 'Gather feedback on the prototype and make necessary revisions to the user interface.',
				state: TaskState.TODO,
				author: 'mock'
			  },
			  {
				title: 'Client Presentation',
				description: 'Prepare a presentation for the client showcasing the project progress and features.',
				state: TaskState.TODO,
				author: 'mock'
			  },
			  {
				title: 'Research Market Trends',
				description: 'Conduct market research to identify current trends and customer preferences.',
				state: TaskState.PROGRESS,
				author: 'mock'
			  },
			  {
				title: 'Code Refactoring',
				description: 'Optimize and refactor existing codebase to improve performance and maintainability.',
				state: TaskState.PROGRESS,
				author: 'mock'
			  },
			  {
				title: 'Develop Prototype',
				description: 'Create a prototype for the new product feature based on the research findings.',
				state: TaskState.REVIEW,
				author: 'mock'
			  },
			  {
				title: 'Quality Assurance Testing',
				description: 'Conduct thorough testing to ensure the product meets quality standards.',
				state: TaskState.REVIEW,
				author: 'mock'
			  },
			  {
				title: 'Project Kickoff',
				description: 'Hold a meeting to officially start the project.',
				state: TaskState.DONE,
				author: 'mock'
			  },
			  {
				title: 'Release Version 1.0',
				description: 'Publish the final version of the product.',
				state: TaskState.DONE,
				author: 'mock'
			  }
			]
		  });
	}

	public getTaskList(token: string): Observable<State[]> {
		return of(this.taskList());
	}

	public updateTask(token: string, task: Task): Observable<State[]> {
		return of(this.taskList());
	}

	public updatePosition(token: string, uid: string, state: string, order: number): Observable<State[]> {
		return of(this.taskList());
	}

	public moveToTrashBin(token: string, uid: string): Observable<State[]> {
		return of(this.taskList());
	}
	
	public getTrashBin(token: string): Observable<Task[]> {
		return of(this.trashed());
	}

	public deleteTask(token: string, uid: string): Observable<Task[]> {
		return of(this.trashed());
	}

	public restoreTask(token: string, uid: string): Observable<Task[]> {
		return of(this.trashed());
	}

	public clearTrashBin(token: string): Observable<Response> {
		return of({
			message: 'SUCCESS.CLEAR_TRASH_BIN'
		});
	}

	// ### UTILS ###
	private user(id: string): Observable<User> {
		switch (id) {
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

	private member(): User[] {
		return [
			{
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
			},    
			{
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
			},
			{
				token: 'member',
				username: 'member',
				fullName: 'Mock Member',
				initials: 'MM',
				color: '#FFFFFF',
				language: 'de',
				project: 'mockProject',
				permission: Permission.MEMBER,
				profilePicture: '',
				notificationsEnabled: false,
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
			},
			{
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
			}
		];
	}

	private taskList(): State[] {
		return [
			{
			  state: TaskState.NONE,
			  tasks: [
				{
				  uid: 'DHfqbZ18jhH55SFWFGwO',
				  author: 'mock',
				  project: 'works',
				  description: 'Prepare comprehensive documentation for the project, including user manuals and technical guides.',
				  assigned: '',
				  state: TaskState.NONE,
				  history: [
					{
					  previous: null,
					  state: TaskState.NONE,
					  timestamp: 1707706711326,
					  username: 'mock'
					}
				  ],
				  title: 'Documentation',
				  order: 1
				},
				{
				  uid: 'miOt2Q50MAV9onMGc00M',
				  author: 'mock',
				  project: 'works',
				  description: 'Review all aspects of the project and prepare for the final release.',
				  assigned: '',
				  state: TaskState.NONE,
				  history: [
					{
					  previous: null,
					  state: TaskState.NONE,
					  timestamp: 1707706711547,
					  username: 'mock'
					}
				  ],
				  title: 'Finalize Project',
				  order: 2
				},
				{
				  uid: 'L0LJoChgGLAh36tmUip1',
				  author: 'mock',
				  project: 'works',
				  description: 'Prepare comprehensive documentation for the project, including user manuals and technical guides.',
				  assigned: '',
				  state: TaskState.NONE,
				  history: [
					{
					  previous: null,
					  state: TaskState.NONE,
					  timestamp: 1707706984237,
					  username: 'mock'
					}
				  ],
				  title: 'Documentation',
				  order: 3
				},
				{
				  uid: '9Iny1sv25Q66y7OE3fZI',
				  author: 'mock',
				  project: 'works',
				  description: 'Review all aspects of the project and prepare for the final release.',
				  assigned: '',
				  state: TaskState.NONE,
				  history: [
					{
					  previous: null,
					  state: TaskState.NONE,
					  timestamp: 1707706984404,
					  username: 'mock'
					}
				  ],
				  title: 'Finalize Project',
				  order: 4
				},
				{
				  uid: 'wsDH9KPgDuoiQqEugq4e',
				  author: 'test',
				  project: 'works',
				  description: '',
				  assigned: '',
				  state: TaskState.NONE,
				  history: [
					{
					  previous: null,
					  state: TaskState.NONE,
					  timestamp: 1707948639928,
					  username: 'test'
					}
				  ],
				  title: 'TEST',
				  order: 5
				}
			  ]
			},
			{
			  state: TaskState.TODO,
			  tasks: [
				{
				  uid: 'fOJ45cgoAmxnUWIhBHrw',
				  author: 'mock',
				  project: 'works',
				  description: 'Draft a detailed project proposal outlining goals, scope, and deliverables.',
				  assigned: '',
				  state: TaskState.TODO,
				  history: [
					{
					  previous: null,
					  state: TaskState.TODO,
					  timestamp: 1707706711761,
					  username: 'mock'
					}
				  ],
				  title: 'Complete Project Proposal',
				  order: 1
				},
				{
				  uid: 'FjkpaYdHyqrvIHM3z1wo',
				  author: 'mock',
				  project: 'works',
				  description: 'Gather feedback on the prototype and make necessary revisions to the user interface.',
				  assigned: '',
				  state: TaskState.TODO,
				  history: [
					{
					  previous: null,
					  state: TaskState.TODO,
					  timestamp: 1707706711969,
					  username: 'mock'
					}
				  ],
				  title: 'Revise User Interface',
				  order: 2
				},
				{
				  uid: 'qa0IeDmEyV1C0ogSRdkV',
				  author: 'mock',
				  project: 'works',
				  description: 'Prepare a presentation for the client showcasing the project progress and features.',
				  assigned: '',
				  state: TaskState.TODO,
				  history: [
					{
					  previous: null,
					  state: TaskState.TODO,
					  timestamp: 1707706712166,
					  username: 'mock'
					}
				  ],
				  title: 'Client Presentation',
				  order: 3
				},
				{
				  uid: 'PHASIp2YXGwKALHqnsVs',
				  author: 'mock',
				  project: 'works',
				  description: 'Draft a detailed project proposal outlining goals, scope, and deliverables.',
				  assigned: '',
				  state: TaskState.TODO,
				  history: [
					{
					  previous: null,
					  state: TaskState.TODO,
					  timestamp: 1707706984558,
					  username: 'mock'
					}
				  ],
				  title: 'Complete Project Proposal',
				  order: 4
				},
				{
				  uid: 'TcxyseGyDpgTPPYHRn1l',
				  author: 'mock',
				  project: 'works',
				  description: 'Gather feedback on the prototype and make necessary revisions to the user interface.',
				  assigned: '',
				  state: TaskState.TODO,
				  history: [
					{
					  previous: null,
					  state: TaskState.TODO,
					  timestamp: 1707706984701,
					  username: 'mock'
					}
				  ],
				  title: 'Revise User Interface',
				  order: 5
				}
			  ]
			},
			{
			  state: TaskState.PROGRESS,
			  tasks: [
				{
				  uid: 'ap1qmOAuMnzrAJLcb4Jd',
				  author: 'mock',
				  project: 'works',
				  description: 'Conduct market research to identify current trends and customer preferences.',
				  assigned: '',
				  state: TaskState.PROGRESS,
				  history: [
					{
					  previous: null,
					  state: TaskState.PROGRESS,
					  timestamp: 1707706712367,
					  username: 'mock'
					}
				  ],
				  title: 'Research Market Trends',
				  order: 1
				},
				{
				  uid: 'TFo1AG123JyitAETS52A',
				  author: 'mock',
				  project: 'works',
				  description: 'Optimize and refactor existing codebase to improve performance and maintainability.',
				  assigned: '',
				  state: TaskState.PROGRESS,
				  history: [
					{
					  previous: null,
					  state: TaskState.PROGRESS,
					  timestamp: 1707706712566,
					  username: 'mock'
					}
				  ],
				  title: 'Code Refactoring',
				  order: 2
				},
				{
				  uid: 'enm3q1D8bm0RuzYIFCjI',
				  author: 'mock',
				  project: 'works',
				  description: 'Conduct market research to identify current trends and customer preferences.',
				  assigned: '',
				  state: TaskState.PROGRESS,
				  history: [
					{
					  previous: null,
					  state: TaskState.PROGRESS,
					  timestamp: 1707706984989,
					  username: 'mock'
					}
				  ],
				  title: 'Research Market Trends',
				  order: 3
				},
				{
				  uid: '26kZkgg5BaAfqn25FZTP',
				  author: 'mock',
				  project: 'works',
				  description: 'Optimize and refactor existing codebase to improve performance and maintainability.',
				  assigned: '',
				  state: TaskState.PROGRESS,
				  history: [
					{
					  previous: null,
					  state: TaskState.PROGRESS,
					  timestamp: 1707706985141,
					  username: 'mock'
					}
				  ],
				  title: 'Code Refactoring',
				  order: 4
				}
			  ]
			},
			{
			  state: TaskState.REVIEW,
			  tasks: [
				{
				  uid: 'ayfiZN4sAIUmr3hRPpvA',
				  author: 'mock',
				  project: 'works',
				  description: 'Create a prototype for the new product feature based on the research findings.',
				  assigned: '',
				  state: TaskState.REVIEW,
				  history: [
					{
					  previous: null,
					  state: TaskState.REVIEW,
					  timestamp: 1707706712767,
					  username: 'mock'
					}
				  ],
				  title: 'Develop Prototype',
				  order: 1
				},
				{
				  uid: 'N8bxoEq4g012sY5Y83bf',
				  author: 'mock',
				  project: 'works',
				  description: 'Conduct thorough testing to ensure the product meets quality standards.',
				  assigned: '',
				  state: TaskState.REVIEW,
				  history: [
					{
					  previous: null,
					  state: TaskState.REVIEW,
					  timestamp: 1707706712945,
					  username: 'mock'
					}
				  ],
				  title: 'Quality Assurance Testing',
				  order: 2
				},
				{
				  uid: 'dk8n2dxpQoybNkRp9kUE',
				  author: 'mock',
				  project: 'works',
				  description: 'Create a prototype for the new product feature based on the research findings.',
				  assigned: '',
				  state: TaskState.REVIEW,
				  history: [
					{
					  previous: null,
					  state: TaskState.REVIEW,
					  timestamp: 1707706985307,
					  username: 'mock'
					}
				  ],
				  title: 'Develop Prototype',
				  order: 3
				},
				{
				  uid: 'o8TwVDf6sW57zJzcj4jS',
				  author: 'mock',
				  project: 'works',
				  description: 'Conduct thorough testing to ensure the product meets quality standards.',
				  assigned: '',
				  state: TaskState.REVIEW,
				  history: [
					{
					  previous: null,
					  state: TaskState.REVIEW,
					  timestamp: 1707706985455,
					  username: 'mock'
					}
				  ],
				  title: 'Quality Assurance Testing',
				  order: 4
				}
			  ]
			},
			{
			  state: TaskState.DONE,
			  tasks: [
				{
				  uid: 'Ai1T0BCX4xRwLuD96fla',
				  author: 'mock',
				  project: 'works',
				  description: 'Hold a meeting to officially start the project.',
				  assigned: '',
				  state: TaskState.DONE,
				  history: [
					{
					  previous: null,
					  state: TaskState.DONE,
					  timestamp: 1707706713118,
					  username: 'mock'
					}
				  ],
				  title: 'Project Kickoff',
				  order: 1
				},
				{
				  uid: 'Ji0Vet5TsrlO32iZpwgq',
				  author: 'mock',
				  project: 'works',
				  description: 'Publish the final version of the product.',
				  assigned: '',
				  state: TaskState.DONE,
				  history: [
					{
					  previous: null,
					  state: TaskState.DONE,
					  timestamp: 1707706713301,
					  username: 'mock'
					}
				  ],
				  title: 'Release Version 1.0',
				  order: 2
				},
				{
				  uid: 'KNtKn3USQ8ULYkwmMxe7',
				  author: 'mock',
				  project: 'works',
				  description: 'Hold a meeting to officially start the project.',
				  assigned: '',
				  state: TaskState.DONE,
				  history: [
					{
					  previous: null,
					  state: TaskState.DONE,
					  timestamp: 1707706985601,
					  username: 'mock'
					}
				  ],
				  title: 'Project Kickoff',
				  order: 3
				}
			  ]
			}
		];
	}

	private trashed(): Task[] {
		return [
			{
			  uid: 'L0LJoChgGLAh36tmUip1',
			  author: 'owner',
			  project: 'mockProject',
			  description: 'Prepare comprehensive documentation for the project, including user manuals and technical guides.',
			  assigned: '',
			  history: [
				{
				  previous: null,
				  state: TaskState.NONE,
				  timestamp: 1707706984237,
				  username: 'owner'
				}
			  ],
			  title: 'Documentation',
			  order: 3,
			  state: TaskState.DELETED
			},
			{
			  uid: 'dk8n2dxpQoybNkRp9kUE',
			  author: 'owner',
			  project: 'mockProject',
			  description: 'Create a prototype for the new product feature based on the research findings.',
			  assigned: '',
			  history: [
				{
				  previous: null,
				  state: TaskState.REVIEW,
				  timestamp: 1707706985307,
				  username: 'owner'
				}
			  ],
			  title: 'Develop Prototype',
			  order: 3,
			  state: TaskState.DELETED
			},
			{
			  uid: 'enm3q1D8bm0RuzYIFCjI',
			  author: 'owner',
			  project: 'mockProject',
			  description: 'Conduct market research to identify current trends and customer preferences.',
			  assigned: '',
			  history: [
				{
				  previous: null,
				  state: TaskState.PROGRESS,
				  timestamp: 1707706984989,
				  username: 'owner'
				}
			  ],
			  title: 'Research Market Trends',
			  order: 3,
			  state: TaskState.DELETED
			},
			{
			  uid: 'TcxyseGyDpgTPPYHRn1l',
			  author: 'owner',
			  project: 'mockProject',
			  description: 'Gather feedback on the prototype and make necessary revisions to the user interface.',
			  assigned: '',
			  history: [
				{
				  previous: null,
				  state: TaskState.TODO,
				  timestamp: 1707706984701,
				  username: 'owner'
				}
			  ],
			  title: 'Revise User Interface',
			  order: 5,
			  state: TaskState.DELETED
			}
		  ]
	}
}
