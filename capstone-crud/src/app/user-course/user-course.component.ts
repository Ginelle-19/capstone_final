import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-user-course',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
    // HttpClient
  ],
  templateUrl: './user-course.component.html',
  styleUrl: './user-course.component.css'
})
export class UserCourseComponent {
  CourseArray: any[] = [];
  isResultLoaded = false;

  constructor(private http: HttpClient) {
    this.getAllCourses();
  }

  getAllCourses() {
    this.http.get("http://localhost:8085/api/courses")
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.CourseArray = resultData.data;
      });
    }
}
