import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';

describe('StorageService', () => {
	const key = 'mock';
	const data = { value: 'mock' };
	const localKey = 'localMock';
	const localData = { value: 'localMock' };
	const sessionKey = 'sessionMock';
	const sessionData = { value: 'sessionMock' };
	let storageService: StorageService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		storageService = TestBed.inject(StorageService);
	});

	describe('setup', () => {
		it('should be created', () => {
			expect(storageService).toBeTruthy();
		});
	
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	});

	describe('Local Storage', () => {
		it('should set and get local entry', () => {
			storageService.setLocalEntry(key, data);
			const result = storageService.getLocalEntry(key);
			expect(result).toEqual(data);
		});
	
		it('should delete local entry', () => {
			storageService.setLocalEntry(key, data);
			storageService.deleteLocalEntry(key);
			const result = storageService.getLocalEntry(key);
			expect(result).toEqual({});
		});
	
		it('should clear local storage', () => {
			storageService.setLocalEntry(key, data);
			storageService.clearLocal();
			const result = storageService.isLocalEmpty();
			expect(result).toBe(true);
		});
	});
	
	describe('Session Storage', () => {
		it('should set and get session entry', () => {
			storageService.setSessionEntry(key, data);
			const result = storageService.getSessionEntry(key);
			expect(result).toEqual(data);
		});
	
		it('should delete session entry', () => {
			storageService.setSessionEntry(key, data);
			storageService.deleteSessionEntry(key);
			const result = storageService.getSessionEntry(key);
			expect(result).toEqual({});
		});
	
		it('should clear session storage', () => {
			storageService.setSessionEntry(key, data);
			storageService.clearSession();
			const result = storageService.isSessionEmpty();
			expect(result).toBe(true);
		});
	});
	
	it('should clear both local and session storage', () => {
		storageService.setLocalEntry(localKey, localData);
		storageService.setSessionEntry(sessionKey, sessionData);
		storageService.clearAll();
		const localResult = storageService.isLocalEmpty();
		const sessionResult = storageService.isSessionEmpty();
		expect(localResult).toBe(true);
		expect(sessionResult).toBe(true);
	});
});
