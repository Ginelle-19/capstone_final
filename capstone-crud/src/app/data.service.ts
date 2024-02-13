// equipment.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators'


@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:8085/api/equipments';
  private conUrl = 'http://localhost:8085/api/consumables'
  private Url = 'http://localhost:8085/api/users';

  constructor(private http: HttpClient) {}

  getEquipmentsByCourseId(CourseID: number): Observable<any> {
    const url = `${this.apiUrl}/${CourseID}`;
    return this.http.get(url);
  }
  getConsumablesByCourseId(CourseID: number): Observable<any> {
    const url = `${this.conUrl}/${CourseID}`;
    return this.http.get(url);
  }
  getUsersByAccountID(AccountID: number): Observable<any> {
    const url = `${this.Url}/${AccountID}`;
    return this.http.get(url);
  }
// to get courses
  getCourses(): Observable<any> {
    const url = 'http://localhost:8085/api/courses';
    return this.http.get(url);
  }

addUser(newUser: { UserName: string, Password: string }): Observable<any> {
  return this.http.post(`${this.Url}/register`, newUser);
}
getUsers(): Observable<any[]> {
  return this.http.get<any>(this.Url).pipe(
    map(response => {
      if (Array.isArray(response)) {
        // If the response is already an array, return it
        return response;
      } else if (typeof response === 'object') {
        // If the response is an object, convert it to an array
        return Object.keys(response).map(key => response[key]);
      } else {
        // If the response is neither an array nor an object, return an empty array
        return [];
      }
    }),
    catchError(this.handleError)
  );
}
private handleError(error: any): Observable<never> {
  console.error('An error occurred:', error);
  return throwError('Something went wrong. Please try again later.');
}

}
