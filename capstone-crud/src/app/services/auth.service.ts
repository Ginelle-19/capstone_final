// import { Injectable } from '@angular/core';
// import { DataService } from '../data.service';
// import { Observable, of } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';

// const AUTH_API = ''

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private isLogged: boolean = false;

//   constructor(private dataService: DataService) { }


//   login(UserName: string, Password: string): Observable<any | null> {
//     return this.dataService.getUsers().pipe(
//       tap((response) => console.log('Users received in AuthService:', response)),
//       map((response: any[]) => {
//         // Check if the response is an array and has at least two elements
//         if (Array.isArray(response) && response.length >= 2) {
//           const users = response[1]; // Assuming users are at index 1
  
//           const user = users.find((u: any) => u.UserName === UserName && u.Password === Password);
  
//           if (user && user.isActive === 1) {
//             // User found and isActive is 1
//             this.isLogged = true;
//             console.log('User logged in:', { UserName: user.UserName /* other necessary information */ });
//             return user;
//           } else if (user && user.isActive === 0) {
//             // User found but isActive is 0, do not allow login
//             console.log('User found but not active. Cannot login.');
//             return 'not_approved'; // Return a special value to indicate not approved
//           } else {
//             // User not found or invalid credentials
//             this.isLogged = false;
//             console.log('User not found or invalid credentials');
//             return null;
//           }
//         } else {
//           console.error('Invalid response from DataService: Expected an array with at least two elements but received', response);
//           return null;
//         }
//       }),
//       catchError((error) => {
//         console.error('Error fetching users:', error);
//         return of(null);
//       })
//     );
//   }
  

//   logout(): void {
//     this.isLogged = false;
//   }

//   isAuthenticated(): boolean {
//     return this.isLogged;
//   }
// }


// import { Injectable } from '@angular/core';
// import { DataService } from '../data.service';
// import { Observable, of } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private tokenKey = 'auth_token'; // Key for storing token in local storage
//   private currentUser: any; // Property to store the current user

//   constructor(private dataService: DataService) { }

//   login(UserName: string, Password: string): Observable<any | null> {
//     return this.dataService.getUsers().pipe(
//       tap((response) => console.log('Users received in AuthService:', response)),
//       map((response: any[]) => {
//         if (Array.isArray(response) && response.length >= 2) {
//           const users = response[1];
  
//           const user = users.find((u: any) => u.UserName === UserName && u.Password === Password);
  
//           if (user && user.isActive === 1) {
//             // Generate token and store it
//             const token = this.generateToken();
//             this.storeToken(token);
//             console.log('User logged in:', { UserName: user.UserName /* other necessary information */ });
//             console.log('Fetched currentUser:', user);
          
//             // Assign the currentUser object with the user's information and accessLevelID
//             this.currentUser = { ...user, AccessLevelID: user.AccessLevelID }; 
          
//             console.log('Set currentUser:', this.currentUser);
//             return this.currentUser;
//           } else if (user && user.isActive === 0) {
//             console.log('User found but not active. Cannot login.');
//             return 'not_approved';
//           } else {
//             console.log('User not found or invalid credentials');
//             return null;
//           }
//         } else {
//           console.error('Invalid response from DataService: Expected an array with at least two elements but received', response);
//           return null;
//         }
//       }),
//       catchError((error) => {
//         console.error('Error fetching users:', error);
//         return of(null);
//       })
//     );
//   }
  

//   private generateToken(): string {
//     // Generate a random token (you may use a proper token generation library)
//     return Math.random().toString(36).substr(2); // Example token generation
//   }

//   private storeToken(token: string): void {
//     // Store token in local storage
//     localStorage.setItem(this.tokenKey, token);
//   }

//   logout(): void {
//     // Remove token from local storage
//     localStorage.removeItem(this.tokenKey);
//     this.currentUser = null; // Clear the current user on logout
//   }

//   getCurrentUser(): any {
//     // Return the current user
//     return this.currentUser;
//   }

//   isAuthenticated(): boolean {
//     // Check if localStorage is defined
//     if (typeof localStorage !== 'undefined') {
//       // Check if token exists in local storage
//       return !!localStorage.getItem(this.tokenKey);
//     }
//     return false; // Return false if localStorage is not available
//   }
// }





  // login(UserName: string, Password: string): Observable<any | null> {
  //   return this.dataService.getUsers().pipe(
  //     tap((response) => console.log('Users received in AuthService:', response)),
  //     map((response: any[]) => {
  //       if (Array.isArray(response) && response.length >= 2) {
  //         const users = response[1]; 
  
  //         const user = users.find((u: any) => u.UserName === UserName && u.Password === Password);
  
  //         if (user) {
  //           this.isLogged = true;
  //           console.log('User logged in:', { UserName: user.UserName /* other necessary information */ });
  //           return user;
  //         } else {
  //           this.isLogged = false;
  //           console.log('User not found or invalid credentials');
  //           return null;
  //         }
  //       } else {
  //         console.error('Invalid response from DataService: Expected an array with at least two elements but received', response);
  //         return null;
  //       }
  //     }),
  //     catchError((error) => {
  //       console.error('Error fetching users:', error);
  //       return of(null);
  //     })
  //   );
  // }

  import { Injectable } from '@angular/core';
  import { DataService } from '../data.service';
  import { Observable, of, throwError } from 'rxjs';
  import { catchError, map, tap } from 'rxjs/operators';
  import { HttpClient } from '@angular/common/http';
  
  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {
  
    public currentUser: any = null;
    private isAuthenticated: boolean = false;
  
    constructor(private dataService: DataService, private http: HttpClient) { }
  
    login(UserName: string, Password: string): Observable<any | null> {
      return this.dataService.getUsers().pipe(
        tap((response) => console.log('Users received in AuthService:', response)),
        map((response: any[]) => {
          if (Array.isArray(response) && response.length >= 2) {
            const users = response[1];
            const user = users.find((u: any) => u.UserName === UserName && u.Password === Password);
            if (user && user.isActive === 1) {
              this.currentUser = { ...user, AccountID: user.AccountID }; // Include AccountID in currentUser
              this.isAuthenticated = true; // Set isAuthenticated to true after successful login
              console.log('User logged in:', { UserName: user.UserName /* other necessary information */ });
              return user;
            } else if (user && user.isActive === 0) {
              console.log('User found but not active. Cannot login.');
              return 'not_approved';
            } else {
              console.log('User not found or invalid credentials');
              return null;
            }
          } else {
            console.error('Invalid response from DataService:', response);
            return null;
          }
        }),
        catchError((error) => {
          console.error('Error fetching users:', error);
          return of(null);
        })
      );
    }
    
    logout(): void {
      const confirmLogout = confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        this.currentUser = null;
        this.isAuthenticated = false; // Clear currentUser and isAuthenticated on logout
      }
    }
  
   getCurrentUser(AccountID?: number): Observable<any> {
    if (this.currentUser && this.currentUser.AccountID) {
    // Return the current user if available
    return of(this.currentUser);
  } else {
    // Fetch the current user from the data service using account ID
    const userID = AccountID || (this.currentUser && this.currentUser.AccountID);
    if (!userID) {
      console.error('No valid current user or AccountID');
      return throwError('No valid current user or AccountID');
    }
    return this.dataService.getUsersByAccountID(userID).pipe(
      tap((user) => {
        // Update the currentUser property with the fetched user data
        this.currentUser = user;
      }),
      catchError(error => {
        console.error('Error fetching current user:', error);
        return throwError(error);
      })
    );
  }
}
    

    // getUserByAccountID(AccountID: number): Observable<any> {
    //   return this.dataService.getUsersByAccountID(AccountID).pipe(
    //     map(users => users[0]) // Assuming there's only one user for a given AccountID
    //   );
    // }
    getUserByAccountID(AccountID: number): Observable<any> {
      return this.dataService.getUsersByAccountID(AccountID).pipe(
        map(users => {
          if (Array.isArray(users) && users.length > 0) {
            return users[0]; // Return the first user if the array is not empty
          } else {
            throw new Error('No user found for the given AccountID');
          }
        }),
        catchError(error => {
          console.error('Error fetching user data:', error);
          throw error; // Re-throw the error to propagate it to the caller
        })
      );
    }
  
    getIsAuthenticated(): boolean {
      return this.isAuthenticated;
    }

    updateCurrentUser(updatedUserData: any): void {
      // Update the currentUser property with the updated user data
      this.currentUser = { ...this.currentUser, ...updatedUserData };
    }

    private beforeUnloadListener: EventListenerOrEventListenerObject | null = null;
confirmLogoutOnRefresh(): void {
  this.beforeUnloadListener = (event: BeforeUnloadEvent) => {
    // Prompt the user with a confirmation dialog
    const confirmationMessage = 'Are you sure you want to refresh? You will be logged out.';
    (event || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  };
  window.addEventListener('beforeunload', this.beforeUnloadListener);
}

// Call this method to remove the event listener
removeLogoutConfirmation(): void {
  if (this.beforeUnloadListener) {
    window.removeEventListener('beforeunload', this.beforeUnloadListener);
    this.beforeUnloadListener = null;
  }
}
    
  }
  




