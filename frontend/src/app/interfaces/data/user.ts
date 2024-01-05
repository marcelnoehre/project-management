import { Permission } from "src/app/enums/permission.enum";

export interface User {
    [key: string]: any,
    token: string,
    username: string,
    fullName: string,
    initials: string,
    language: string,
    project: string,
    permission: Permission,
    profilePicture: string,
    isLoggedIn: boolean
}