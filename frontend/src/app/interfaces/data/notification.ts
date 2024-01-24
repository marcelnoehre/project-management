import { Timestamp } from "./timestamp";

export interface Notification {
    message: string,
    timestamp: Timestamp,
    seen: boolean
}