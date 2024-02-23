import { CanActivateFn } from '@angular/router';
import { StorageService } from './../services/storage.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
	const _router = new Router();
	const _storage = new StorageService();
	const _user = _storage.getSessionEntry('user');
  
	if (_user?.isLoggedIn && _user?.project !== '') {
		return true;
	}
  
	_router.navigate(['/login']);
	_storage.clearSession();
	return false;
};
