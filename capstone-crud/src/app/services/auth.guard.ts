import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getIsAuthenticated()) {
      return true; // User is authenticated, allow access to the route
    } else {
      // User is not authenticated, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
