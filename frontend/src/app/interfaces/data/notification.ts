import { Timestamp } from "./timestamp";

export interface Notification {
    uid: string,
    message: string,
    timestamp: Timestamp,
    seen: boolean
}