import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StorageService {
	public getLocalEntry(key: string): any {
		return JSON.parse(localStorage.getItem(key) || '{}');
	}

	public setLocalEntry(key: string, data: unknown): void {
		localStorage.setItem(key, JSON.stringify(data));
	}

	public deleteLocalEntry(key: string): void {
		localStorage.removeItem(key);
	}

	public clearLocal(): void {
		localStorage.clear();
	}

	public isLocalEmpty(): boolean {
		return localStorage.length === 0;
	}

	public getSessionEntry(key: string): any {
		return JSON.parse(sessionStorage.getItem(key) || '{}');
	}

	public setSessionEntry(key: string, data: unknown): void {
		sessionStorage.setItem(key, JSON.stringify(data));
	}

	public deleteSessionEntry(key: string): void {
		sessionStorage.removeItem(key);
	}

	public clearSession(): void {
		sessionStorage.clear();
	}

	public isSessionEmpty(): boolean {
		return sessionStorage.length === 0;
	}

	public clearAll(): void {
		this.clearLocal();
		this.clearSession();
	}
} 