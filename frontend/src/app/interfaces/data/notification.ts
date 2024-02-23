export interface Notification {
	uid: string,
	message: string,
	data: string[],
	icon: string,
	timestamp: number,
	seen: boolean
}