import { Permission } from "src/app/enums/permission.enum";

export interface User {
    [key: string]: any,
    token: string,
    username: string,
    fullName: string,
    initials: string,
    color: string,
    language: string,
    project: string,
    permission: Permission,
    profilePicture: string,
    notificationsEnabled: boolean,
    isLoggedIn: boolean
}