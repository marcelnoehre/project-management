import { Injectable } from '@angular/core';
import { AdapterService } from './adapter.service';
import { DbService } from './db.service';
import { MockService } from './mock.service';
import { Adapter } from 'src/app/enums/adapter.enum';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/data/user';
import { State } from 'src/app/interfaces/data/state';
import { Response } from 'src/app/interfaces/data/response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private adapter!: AdapterService;
  private chosenAdapter = environment.selectedApi;
  
  constructor(
    private db: DbService,
    private mock: MockService
  ) {
    this.resolveAdapter();
  }

	private resolveAdapter() {
		switch (this.chosenAdapter) {
			case Adapter.db:
				this.adapter = this.db;
				break;
			case Adapter.mock:
				this.adapter = this.mock;
				break;
			default:
				console.error('No adapter!');
				break;
		}
	}

	// ### AUTH ###
	public login(username: string, password: string): Observable<User> {
		return this.adapter.login(username, password);
	}

	public register(username: string, password: string, fullName: string, language: string): Observable<Response> {
		return this.adapter.register(username, password, fullName, language);
	}

	public verify(token: string, username: string): Observable<User> {
		return this.adapter.verify(token, username);
	}

	public updateUser(token: string, username: string, attribute: string, value: string): Observable<Response> {
		return this.adapter.updateUser(token, username, attribute, value);
	}

	public toggleNotifications(token: string, username: string, notificationsEnabled: boolean): Observable<Response> {
		return this.adapter.toggleNotifications(token, username, notificationsEnabled);
	}

	public deleteUser(token: string, username: string): Observable<Response> {
		return this.adapter.deleteUser(token, username);
	}


	// ### PROJECT ###
	public createProject(token: string, username: string, project: string): Observable<Response> {
		return this.adapter.createProject(token, username, project);
	}
	
	public getTeamMembers(token: string, project: string): Observable<User[]> {
		return this.adapter.getTeamMembers(token, project);
	}

	public inviteUser(token: string, username: string, project: string): Observable<User> {
		return this.adapter.inviteUser(token, username, project);
	}

	public handleInvite(token: string, username: string, decision: boolean): Observable<Response> {
		return this.adapter.handleInvite(token, username, decision);
	}

	public removeUser(token: string, username: string): Observable<Response> {
		return this.adapter.removeUser(token, username);
	}


	// ### TASKS ###
	public createTask(token: string, author: string, project: string, title: string, description: string, assigned: string, state: string): Observable<Response> {
		return this.adapter.createTask(token, author, project, title, description, assigned, state);
	}

	public getTaskList(token: string, project: string): Observable<State[]> {
		return this.adapter.getTaskList(token, project);
	}

	public updatePosition(token: string, project: string, uid: string, state: string, order: number): Observable<State[]> {
		return this.adapter.updatePosition(token, project, uid, state, order);
	}

	public moveToTrashBin(token: string, uid: string): Observable<Response> {
		return this.adapter.moveToTrashBin(token, uid);
	}
	
}
