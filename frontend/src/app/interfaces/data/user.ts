export interface User {
    [key: string]: any,
    token: string,
    username: string,
    fullName: string,
    initials: string,
    language: string,
    project: string,
    permission: string,
    profilePicture: string,
    isLoggedIn: string
}