import { Injectable } from '@angular/core';
import { Permission } from '../enums/permission.enum';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private project!: string;
  private permission!: Permission;
  private strength: Permission[] = [Permission.INVITED, Permission.MEMBER, Permission.ADMIN, Permission.OWNER];

  constructor() { }

  setProject(project: string): void {
    this.project = project;
  }

  setPermission(permission: Permission): void {
    this.permission = permission;
  }

  getProject(): string {
    return this.project;
  }

  hasPermission(required: Permission) {
    return this.strength.indexOf(this.permission) >= this.strength.indexOf(required);
  }

}
