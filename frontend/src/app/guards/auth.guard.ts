import { CanActivateFn } from '@angular/router';
import { StorageService } from './../services/storage.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export const authGuard: CanActivateFn = () => {
	if (environment.environement === 'test') return true;

	const router = new Router();
	const storage = new StorageService();
	const user = storage.getSessionEntry('user');
  
	if (user?.isLoggedIn && user?.project !== '') return true;
  
	router.navigate(['/login']);
	storage.clearSession();
	return false;
};
