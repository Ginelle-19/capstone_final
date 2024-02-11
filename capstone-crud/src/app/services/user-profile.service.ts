import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ResolveData } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService implements Resolve<Observable<any> | Promise<any> | any> {

  constructor(private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const AccountID = route.params['AccountID'];
    // Pass the user ID to getCurrentUser() to fetch the user's data
    return this.authService.getCurrentUser(AccountID);
  }
}
