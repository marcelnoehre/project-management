export interface Notification {
    uid: string,
    message: string,
    data: string[],
    timestamp: number,
    seen: boolean
}