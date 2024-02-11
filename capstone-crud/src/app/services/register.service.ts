import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'http://localhost:8085'; // Replace with your actual backend API URL

  constructor(private http: HttpClient) {}

  register(UserName: string, Password: string, FirstName: string, LastName: string, Birthdate: string, StudentNum: number): Observable<any> {
    const newUser = {
      UserName: UserName,
      Password: Password,
      FirstName: FirstName,
      LastName: LastName,
      Birthdate: Birthdate,
      StudentNum: StudentNum
    };
    

    // Make an HTTP post request to register the new user
    return this.http.post(`${this.apiUrl}/api/users/add`, newUser).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        console.log('Server response:', error.error); // Log the actual response received from the server
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }

  checkStudentNumber(studentNum: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/api/users/check/${studentNum}`).pipe(
      catchError((error) => {
        console.error('Error checking student number:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }
}
