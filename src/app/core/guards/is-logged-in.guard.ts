import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    if (localStorage.getItem('token') != null) {
      _Router.navigate(['/User/Shop']);
      return false;
    } else {
      return true;
    }
  }
  return false;
};
