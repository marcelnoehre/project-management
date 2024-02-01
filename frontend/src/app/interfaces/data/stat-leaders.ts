import { StatLeader } from "./stat-leader"

export interface StatLeaders {
    created: StatLeader
    imported: StatLeader
    edited: StatLeader
    trashed: StatLeader
    restored: StatLeader
    deleted: StatLeader
    cleared: StatLeader
}