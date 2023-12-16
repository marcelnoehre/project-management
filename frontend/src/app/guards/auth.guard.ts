import { CanActivateFn } from '@angular/router';
import { StorageService } from './../services/storage.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = new Router();
  const storage = new StorageService();
  const user = storage.getSessionEntry('user');
  
  if (user?.isLoggedIn) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
