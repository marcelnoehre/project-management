import { Injectable } from '@angular/core';
import { AdapterService } from './adapter.service';
import { DbService } from './db.service';
import { MockService } from './mock.service';
import { Adapter } from 'src/app/enums/adapter.enum';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/data/user';
import { State } from 'src/app/interfaces/state';
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


	// ### PROJECT ###
	public createProject(username: string, project: string): Observable<Response> {
		return this.adapter.createProject(username, project);
	}
	
	public getTeamMembers(project: string): Observable<User[]> {
		return this.adapter.getTeamMembers(project);
	}


	// ### TASKS ###
	public getTaskList(): Observable<State[]> {
		return this.adapter.getTaskList();
	}
}
