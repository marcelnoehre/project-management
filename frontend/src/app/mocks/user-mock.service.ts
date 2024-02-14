import { Injectable } from '@angular/core';
import { User } from '../interfaces/data/user';
import { Permission } from '../enums/permission.enum';

@Injectable({
  providedIn: 'root'
})
export class MockUserService {
  private permissions: Permission[] = [Permission.INVITED, Permission.MEMBER, Permission.ADMIN, Permission.OWNER];
  private userObj: User = {
    token: "1234",
    username: "owner",
    fullName: "Mock Owner",
    language: "en",
    profilePicture: "",
    initials: "MO",
    color: "#FFFFFF",
    project: "mockProject",
    permission: Permission.OWNER,
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
}

  constructor() { }

  get user(): User {
    return this.userObj;
  }

  get token(): string {
    return this.userObj.token;
  }

  get username(): string {
    return this.userObj.username;
  }

  get fullName(): string {
    return this.userObj.fullName;
  }

  get initials(): string {
    return this.userObj.initials;
  }

  get color(): string {
    return this.userObj.color;
  }

  get language(): string {
    return this.userObj.language;
  }

  get project(): string {
    return this.userObj.project;
  }

  get permission(): string {
    return this.userObj.permission;
  }

  get profilePicture(): string {
    return this.userObj.profilePicture;
  }

  get notificationsEnabled(): boolean {
    return this.userObj.notificationsEnabled;
  }

  get isLoggedIn(): boolean {
    return this.userObj.isLoggedIn;
  }

  set user(user: User) {
    this.userObj = user;
  }

  set token(token: string) {
    this.userObj.token = token;
  }

  set username(username: string) {
    this.userObj.username = username;
  }

  set fullName(fullName: string) {
    this.userObj.fullName = fullName;
  }

  set initials(initials: string) {
    this.userObj.initials = initials;
  }

  set color(color: string) {
    this.userObj.color = color;
  }

  set language(language: string) {
    this.userObj.language = language;
  }

  set project(project: string) {
    this.userObj.project = project;
  }

  set permission(permission: Permission) {
    this.userObj.permission = permission;
  }

  set profilePicture(profilePicture: string) {
    this.userObj.profilePicture = profilePicture;
  }

  set notificationsEnabled(notificationsEnabled: boolean) {
    this.userObj.notificationsEnabled = notificationsEnabled;
  }

  set isLoggedIn(isLoggedIn: boolean) {
    this.userObj.isLoggedIn = isLoggedIn;
  }

  update(attribute: string, value: string) {
    this.userObj[attribute] = value;
  }

  hasPermission(required: Permission) {
    return this.permissions.indexOf(this.permission as Permission) >= this.permissions.indexOf(required);
  }
}
