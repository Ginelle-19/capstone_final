import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    RouterModule,
    FormsModule,
    MatIconModule
  ],
  standalone: true,
})
export class LoginComponent {
  imageUrl: string = '/assets/ccjef_logo.png'
  termsAgreed: boolean = false;

  @ViewChild('UserName') UserName!: ElementRef;
  @ViewChild('Password') Password!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.activeRoute.queryParamMap.subscribe((queries) => {
      const logout = Boolean(queries.get('logout'));
      if (logout) {
        this.authService.logout();
        this.snackbar.open('You are now logged out.', 'Close', {duration:3000});
      }
    });
  }

  OnLoginClicked() {
    if (!this.termsAgreed) {
      this.snackbar.open('You must agree to the Terms and Conditions to log in.', 'Close', { duration: 3000 });
      return;
    }
    
    const UserName = this.UserName.nativeElement.value;
    const Password = this.Password.nativeElement.value;
  
    this.authService.login(UserName, Password).subscribe(
      (user) => {
        if (user) {
          if (user === 'not_approved') {
            alert('Your account has not been approved yet. Please contact the administrator.');
          } else {
            alert('Welcome ' + user.FirstName + '. You are logged in.');
            switch (user.AccessLevelID) {
              case 1: // Student
                this.router.navigate(['/user-menu/user-courses']);
                break;
              case 2: // Super Admin
                this.router.navigate(['/menu/profile']);
                break;
              case 3: // Super Admin
                this.router.navigate(['/admin-menu/profile']);
                break;
              default:
                this.router.navigate(['']);
                break;
            }
          }
        } else {
          alert('The login credentials you have entered are not correct.');
        }
      },
      (error) => {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
      }
    );
  }
}
// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { FormsModule } from '@angular/forms';
// import { MatIconModule } from '@angular/material/icon';
// import { Output, EventEmitter } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
//   imports: [
//     FormsModule,
//     MatIconModule,
//     RouterModule
//   ],
//   standalone: true,
// })
// export class LoginComponent {
//   imageUrl: string = '/assets/ccjef_logo.png'
//   termsAgreed: boolean = false;

//   @Output() logoutEvent = new EventEmitter<void>();


//   @ViewChild('UserName') UserName!: ElementRef;
//   @ViewChild('Password') Password!: ElementRef;

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private activeRoute: ActivatedRoute,
//     private snackbar: MatSnackBar
//   ) {}

//   ngOnInit() {
//     // Check if user is already logged in
//     if (this.authService.isAuthenticated()) {
//       this.redirectUser();
//     }

//     // Handle logout query parameter
//     this.activeRoute.queryParamMap.subscribe((queries) => {
//       const logout = Boolean(queries.get('logout'));
//       if (logout) {
//         this.authService.logout();
//         this.snackbar.open('You are now logged out.', 'Close', {duration:3000});
//       }
//     });
//   }

//   OnLoginClicked() {
//     if (!this.termsAgreed) {
//       this.snackbar.open('You must agree to the Terms and Conditions to log in.', 'Close', { duration: 3000 });
//       return;
//     }
    
//     const UserName = this.UserName.nativeElement.value;
//     const Password = this.Password.nativeElement.value;
  
//     this.authService.login(UserName, Password).subscribe(
//       (user) => {
//         if (user) {
//           if (user === 'not_approved') {
//             alert('Your account has not been approved yet. Please contact the administrator.');
//           } else {
//             alert('Welcome ' + user.FirstName + '. You are logged in.');
//             this.redirectUser();
//           }
//         } else {
//           alert('The login credentials you have entered are not correct.');
//         }
//       },
//       (error) => {
//         console.error('Error during login:', error);
//         alert('An error occurred during login.');
//       }
//     );
//   }

//   logout() {
//     this.authService.logout(); // Call logout() from AuthService
//     this.router.navigate(['/login']); // Redirect to login page after logout
//     this.logoutEvent.emit();
//   }

//   private redirectUser(): void {
//     // Redirect user based on their role or default page
//     const user = this.authService.getCurrentUser();
//     if (user) {
//       switch (user.AccessLevelID) {
//         case 1: // Student
//           this.router.navigate(['/user-menu/user-courses']);
//           break;
//         case 2: // Super Admin
//           this.router.navigate(['/menu/courses']);
//           break;
//         default:
//           this.router.navigate(['']);
//           break;
//       }
//     } else {
//       this.snackbar.open('You are now logged out.', 'Close', {duration:3000});
//     }
//   }
// }
