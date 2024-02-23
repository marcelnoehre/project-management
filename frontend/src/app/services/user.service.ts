import { Injectable } from '@angular/core';
import { User } from '../interfaces/data/user';
import { Permission } from '../enums/permission.enum';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private _permissions: Permission[] = [Permission.INVITED, Permission.MEMBER, Permission.ADMIN, Permission.OWNER];
	private _user: User = {
		token: '',
		username: '',
		fullName: '',
		language: '',
		profilePicture: '',
		initials: '',
		color: '',
		project: '',
		permission: Permission.NONE,
		notificationsEnabled: true,
		isLoggedIn: false,
		stats: {
			created: -1,
			imported: -1,
			updated: -1,
			edited: -1,
			trashed: -1,
			restored: -1,
			deleted: -1,
			cleared: -1
		}
	};

	public get user(): User {
		return this._user;
	}

	public get token(): string {
		return this._user.token;
	}

	public get username(): string {
		return this._user.username;
	}

	public get fullName(): string {
		return this._user.fullName;
	}

	public get initials(): string {
		return this._user.initials;
	}

	public get color(): string {
		return this._user.color;
	}

	public get language(): string {
		return this._user.language;
	}

	public get project(): string {
		return this._user.project;
	}

	public get permission(): Permission {
		return this._user.permission;
	}

	public get profilePicture(): string {
		return this._user.profilePicture;
	}

	public get notificationsEnabled(): boolean {
		return this._user.notificationsEnabled;
	}

	public get isLoggedIn(): boolean {
		return this._user.isLoggedIn;
	}

	public set user(user: User) {
		this._user = user;
	}

	public set token(token: string) {
		this._user.token = token;
	}

	public set username(username: string) {
		this._user.username = username;
	}

	public set fullName(fullName: string) {
		this._user.fullName = fullName;
	}

	public set initials(initials: string) {
		this._user.initials = initials;
	}

	public set color(color: string) {
		this._user.color = color;
	}

	public set language(language: string) {
		this._user.language = language;
	}

	public set project(project: string) {
		this._user.project = project;
	}

	public set permission(permission: Permission) {
		this._user.permission = permission;
	}

	public set profilePicture(profilePicture: string) {
		this._user.profilePicture = profilePicture;
	}

	public set notificationsEnabled(notificationsEnabled: boolean) {
		this._user.notificationsEnabled = notificationsEnabled;
	}

	public set isLoggedIn(isLoggedIn: boolean) {
		this._user.isLoggedIn = isLoggedIn;
	}

	public update(attribute: string, value: string): void {
		this._user[attribute] = value;
	}

	public hasPermission(required: Permission): boolean {
		return this._permissions.indexOf(this.permission as Permission) >= this._permissions.indexOf(required);
	}
}
