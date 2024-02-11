import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EquipmentCrudComponent } from '../equipment-crud/equipment-crud.component';
import { ConsumableCrudComponent } from '../consumable-crud/consumable-crud.component';
import { error } from 'console';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';

// --------------------------------

@Component({
  selector: 'app-course-crud',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterOutlet,
    CommonModule,
    AppComponent,
    FormsModule,
    RouterModule,
    EquipmentCrudComponent,
    ConsumableCrudComponent,
    MatIconModule,
    NgxPaginationModule,
  ],
  templateUrl: './course-crud.component.html',
  styleUrl: './course-crud.component.css',
})
export class CourseCrudComponent {
  CourseID: number = 1;
  EquipmentArray: any[] = [];
  CourseArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  currentID: any;
  CourseCode: string = '';
  CourseName: string = '';

  p: number = 1;
  itemsPerPage: number = 7;
  // added course service, remove if not working
  constructor(private http: HttpClient) {
    this.getAllCourses();
  }

  ngOnInit(): void {}

  getAllCourses() {
    this.http
      .get('http://localhost:8085/api/courses')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.CourseArray = resultData.data;
      });
  }

  register() {
    let bodyData = {
      CourseCode: this.CourseCode,
      CourseName: this.CourseName,
    };

    this.http
      .post('http://localhost:8085/api/courses/add', bodyData)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Course Added Successfully!');
        this.getAllCourses();
      });
  }

  setUpdate(data: any) {
    this.CourseCode = data.CourseCode;
    this.CourseName = data.CourseName;

    this.currentID = data.CourseID;
  }

  UpdateRecords() {
    let bodyData = {
      CourseCode: this.CourseCode,
      CourseName: this.CourseName,
    };

    this.http
      .put(
        'http://localhost:8085/api/courses/update' + '/' + this.currentID,
        bodyData
      )
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Course Updated Successfully!');
        this.getAllCourses();
      });
  }

  save() {
    if (this.currentID == '') {
      this.register();
    } else {
      this.UpdateRecords();
    }
  }

  setDelete(data: any) {
    this.http
      .delete('http://localhost:8085/api/courses/delete' + '/' + data.CourseID)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Record Deleted');
        this.getAllCourses();
      });
  }

  filterEquipments(): void {
    const apiUrl = 'http://localhost:8085/api/equipments/${this.CourseID}';

    this.http.get(apiUrl).subscribe(
      (resultData: any) => {
        console.log(resultData);
        this.EquipmentArray = resultData.data;
      },
      (error) => {
        console.error('Error Connecting to API', error);
      }
    );
  }
  filterEquipment(): void {
    // this.CourseID++;
    this.filterEquipments();
  }
}