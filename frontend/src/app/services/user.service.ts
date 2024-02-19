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
}

  get user(): User {
    return this._user;
  }

  get token(): string {
    return this._user.token;
  }

  get username(): string {
    return this._user.username;
  }

  get fullName(): string {
    return this._user.fullName;
  }

  get initials(): string {
    return this._user.initials;
  }

  get color(): string {
    return this._user.color;
  }

  get language(): string {
    return this._user.language;
  }

  get project(): string {
    return this._user.project;
  }

  get permission(): Permission {
    return this._user.permission;
  }

  get profilePicture(): string {
    return this._user.profilePicture;
  }

  get notificationsEnabled(): boolean {
    return this._user.notificationsEnabled;
  }

  get isLoggedIn(): boolean {
    return this._user.isLoggedIn;
  }

  set user(user: User) {
    this._user = user;
  }

  set token(token: string) {
    this._user.token = token;
  }

  set username(username: string) {
    this._user.username = username;
  }

  set fullName(fullName: string) {
    this._user.fullName = fullName;
  }

  set initials(initials: string) {
    this._user.initials = initials;
  }

  set color(color: string) {
    this._user.color = color;
  }

  set language(language: string) {
    this._user.language = language;
  }

  set project(project: string) {
    this._user.project = project;
  }

  set permission(permission: Permission) {
    this._user.permission = permission;
  }

  set profilePicture(profilePicture: string) {
    this._user.profilePicture = profilePicture;
  }

  set notificationsEnabled(notificationsEnabled: boolean) {
    this._user.notificationsEnabled = notificationsEnabled;
  }

  set isLoggedIn(isLoggedIn: boolean) {
    this._user.isLoggedIn = isLoggedIn;
  }

  update(attribute: string, value: string): void {
    this._user[attribute] = value;
  }

  hasPermission(required: Permission): boolean {
    return this._permissions.indexOf(this.permission as Permission) >= this._permissions.indexOf(required);
  }
}
