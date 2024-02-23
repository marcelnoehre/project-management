export interface StatLeaders {
	created: StatLeader
	imported: StatLeader
	edited: StatLeader
	trashed: StatLeader
	restored: StatLeader
	deleted: StatLeader
	cleared: StatLeader
}

interface StatLeader {
	username: string[],
	value: number
}