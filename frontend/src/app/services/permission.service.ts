import { Injectable } from '@angular/core';
import { Permission } from '../enums/permission.enum';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permission!: Permission;
  private strength: Permission[] = [Permission.OWNER, Permission.ADMIN, Permission.MEMBER, Permission.INVITED];

  constructor() { }

  setPermission(permission: Permission): void {
    this.permission = permission;
  }

  hasPermission(required: Permission) {
    return this.strength.indexOf(this.permission) >= this.strength.indexOf(required);
  }

}
